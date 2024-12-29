import { GroupHero } from "@/components/group/GroupHero";
import { GroupJoinForm } from "@/components/group/GroupJoinForm";
import { CreateGroupCTA } from "@/components/group/CreateGroupCTA";

const GroupLanding = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
      <GroupHero />
      
      <div className="space-y-6">
        <GroupJoinForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
        <CreateGroupCTA />
      </div>
    </div>
  );
};

export default GroupLanding;