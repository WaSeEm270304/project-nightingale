import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AIStage {
  number: number;
  tag: string;
  title: string;
  date: string;
  beginnerExplanation: string;
  analogy: string;
  technicalExplanation: string;
  codeBreakdown: string;
}

interface StoryResult {
  stages: AIStage[];
}

export function useCveStory(cveId: string | undefined) {
  const [aiStages, setAiStages] = useState<AIStage[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!cveId) return;
    setLoading(true);
    setError(null);
    setAiStages(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-cve-story", {
        body: { cveId },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      const story = data?.story as StoryResult;
      if (story?.stages) {
        setAiStages(story.stages);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate story");
    } finally {
      setLoading(false);
    }
  }, [cveId]);

  return { aiStages, loading, error, generate };
}
