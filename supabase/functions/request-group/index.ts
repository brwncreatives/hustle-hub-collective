import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    const adminEmail = Deno.env.get('ADMIN_EMAIL')

    if (!adminEmail) {
      throw new Error('Admin email not configured')
    }

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: adminEmail,
      subject: 'New Group Creation Request',
      html: `
        <p>A new user has requested to create a group.</p>
        <p>Please review their request and follow up accordingly.</p>
      `,
    })

    if (error) {
      throw error
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