import Image from "next/image";
import CTA from "./components/Landing/CTA";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GitBranch, GitCommitIcon } from "lucide-react";

export default function Home() {
  return (
    <div>
      <nav className="w-full bg-sidebar text-foreground">
        <div className="flex items-center justify-between p-3">
          <Link href="/auth" className="font-semibold">
            WikiBinge
          </Link>

          <Button variant="outline" size="icon">
            <GitBranch className="h-4 w-4" />
          </Button>
        </div>
      </nav>
      <CTA/>
    </div>
  );
}
