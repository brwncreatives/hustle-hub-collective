import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Resend } from 'npm:resend'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${authHeader}` } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Failed to get user data')
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Failed to get profile data')
    }

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    const adminEmail = Deno.env.get('ADMIN_EMAIL')

    if (!adminEmail) {
      throw new Error('Admin email not configured')
    }

    const { error: emailError } = await resend.emails.send({
      from: 'Hustle Saturday <onboarding@resend.dev>',
      to: adminEmail,
      subject: 'New Group Creation Request',
      html: `
        <h2>New Group Creation Request</h2>
        <p>A user has requested to create a new accountability group:</p>
        <ul>
          <li>Name: ${profile.first_name} ${profile.last_name}</li>
          <li>Email: ${user.email}</li>
        </ul>
      `,
    })

    if (emailError) {
      throw emailError
    }

    return new Response(
      JSON.stringify({ message: "Request submitted successfully" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})