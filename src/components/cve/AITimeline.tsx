import { motion } from "framer-motion";
import type { AIStage } from "@/hooks/useCveStory";

interface AITimelineProps {
  stages: AIStage[];
  mode: "beginner" | "technical";
}

const AITimeline = ({ stages, mode }: AITimelineProps) => {
  return (
    <div className="relative">
      <p className="text-classified text-primary mb-6 tracking-[0.3em]">// AI-GENERATED VULNERABILITY LIFECYCLE</p>

      {/* Vertical red line */}
      <div className="absolute left-3 md:left-6 top-14 bottom-0 w-px bg-primary/30" />

      <div className="space-y-6 md:space-y-8">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-8 md:pl-16 group"
          >
            {/* Timeline dot */}
            <div className="absolute left-1.5 md:left-4.5 top-2 w-3 h-3 border-2 border-primary bg-background rounded-full group-hover:bg-primary transition-colors" />

            <div className="border border-border p-4 md:p-6 hover:border-primary/50 transition-colors">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                <span className="bg-primary/10 border border-primary/30 px-2 py-0.5 text-classified text-primary">
                  STAGE {stage.number}: {stage.tag.toUpperCase()}
                </span>
                <span className="text-classified text-muted-foreground">{stage.date}</span>
              </div>

              <h3 className="font-heading text-lg md:text-xl text-foreground mb-3">{stage.title}</h3>

              {mode === "beginner" ? (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {stage.beginnerExplanation}
                  </p>
                  <div className="border-l-2 border-primary pl-4 bg-primary/5 py-3 pr-4">
                    <p className="text-classified text-primary mb-1">ANALOGY</p>
                    <p className="text-sm text-foreground italic leading-relaxed">{stage.analogy}</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {stage.technicalExplanation}
                  </p>
                  <div className="border border-border bg-secondary/50 p-4">
                    <p className="text-classified text-primary mb-1">CODE-LEVEL BREAKDOWN</p>
                    <pre className="font-mono text-[11px] text-foreground bg-background/50 border border-border p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {stage.codeBreakdown}
                    </pre>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AITimeline;
