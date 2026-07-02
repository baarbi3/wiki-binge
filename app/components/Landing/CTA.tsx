import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <div className="grid min-h-[calc(100dvh-4rem)] place-items-center px-6 text-foreground">
      <div className="max-w-3xl space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-balance font-display">
            Make your escapism useful
          </h1>

          <h4 className="text-xl font-semibold tracking-tight text-muted-foreground">
            The average person spends 6 hours a day on social media. WikiBinge
            offers a more productive way to scroll.
          </h4>
        </div>

        <div className="flex justify-center gap-3">
          <Button className="cursor-pointer">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button variant="outline">
            View on GitHub
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CTA