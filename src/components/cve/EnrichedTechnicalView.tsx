import type { EnrichedStage } from "@/data/cveEnrichedData";

interface EnrichedTechnicalViewProps {
  enriched: EnrichedStage;
}

const EnrichedTechnicalView = ({ enriched }: EnrichedTechnicalViewProps) => {
  return (
    <div className="border border-border bg-secondary/50 p-4 space-y-4">
      <p className="text-classified text-primary mb-1">TECHNICAL BREAKDOWN</p>

      {/* Affected Versions */}
      <div>
        <p className="text-classified text-muted-foreground text-[10px] mb-1">AFFECTED VERSIONS</p>
        <p className="font-mono text-xs text-foreground">{enriched.affectedVersions}</p>
      </div>

      {/* Attack Vector */}
      <div>
        <p className="text-classified text-muted-foreground text-[10px] mb-1">ATTACK VECTOR</p>
        <p className="font-mono text-xs text-foreground leading-relaxed">{enriched.attackVector}</p>
      </div>

      {/* Root Cause */}
      {enriched.rootCauseCode && (
        <div>
          <p className="text-classified text-muted-foreground text-[10px] mb-1">ROOT CAUSE (CODE-LEVEL)</p>
          <pre className="font-mono text-[11px] text-foreground bg-background/50 border border-border p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {enriched.rootCauseCode}
          </pre>
        </div>
      )}

      {/* Exploit Mechanics */}
      {enriched.exploitMechanics.length > 0 && (
        <div>
          <p className="text-classified text-muted-foreground text-[10px] mb-1">EXPLOIT MECHANICS</p>
          <ol className="list-decimal list-inside space-y-1">
            {enriched.exploitMechanics.map((step, i) => (
              <li key={i} className="font-mono text-xs text-foreground leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Detection Signatures */}
      {enriched.detectionSignatures.length > 0 && (
        <div>
          <p className="text-classified text-muted-foreground text-[10px] mb-1">DETECTION SIGNATURES</p>
          <div className="space-y-1">
            {enriched.detectionSignatures.map((sig, i) => (
              <p key={i} className="font-mono text-[11px] text-foreground bg-background/50 border border-border px-2 py-1.5">
                {sig}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Mitigation Commands */}
      {enriched.mitigationCommands.length > 0 && (
        <div>
          <p className="text-classified text-muted-foreground text-[10px] mb-1">MITIGATION COMMANDS</p>
          <div className="space-y-2">
            {enriched.mitigationCommands.map((cmd, i) => (
              <div key={i}>
                <p className="text-[10px] text-muted-foreground mb-0.5">{cmd.label}</p>
                <pre className="font-mono text-[11px] text-primary bg-background/50 border border-primary/20 px-3 py-2 overflow-x-auto">
                  $ {cmd.command}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patch Info */}
      {enriched.patchInfo.length > 0 && (
        <div>
          <p className="text-classified text-muted-foreground text-[10px] mb-1">PATCH / KB NUMBERS</p>
          <ul className="space-y-0.5">
            {enriched.patchInfo.map((p, i) => (
              <li key={i} className="font-mono text-xs text-foreground">• {p}</li>
            ))}
          </ul>
        </div>
      )}

      {/* PoC Existence */}
      {enriched.pocExists.exists && (
        <div>
          <p className="text-classified text-muted-foreground text-[10px] mb-1">KNOWN POC</p>
          <p className="font-mono text-xs text-primary">
            ✓ YES — {enriched.pocExists.source}
          </p>
        </div>
      )}

      {/* Threat Actors */}
      {enriched.threatActors.length > 0 && (
        <div>
          <p className="text-classified text-muted-foreground text-[10px] mb-1">THREAT ACTOR ATTRIBUTION</p>
          <div className="flex flex-wrap gap-1.5">
            {enriched.threatActors.map((actor) => (
              <span key={actor} className="border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
                {actor}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrichedTechnicalView;
