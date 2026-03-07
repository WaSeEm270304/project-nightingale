// Extended CVE data for detailed views

export interface CveScoring {
  cvssVector: string;
  exploitabilityScore: number;
  impactScore: number;
  epssPercentile: number;
  kevDateAdded: string | null;
  cweName: string;
  scoreSource: string;
  lastModified: string;
  alternativeIds: { type: string; id: string }[];
}

export interface AffectedProduct {
  vendor: string;
  product: string;
  affectedVersions: string;
  fixedVersion: string;
}

export interface CveReference {
  url: string;
  source: string;
  tags: string[];
}

export interface EnrichedStage {
  affectedVersions: string;
  exploitMechanics: string[];
  rootCauseCode: string;
  attackVector: string;
  detectionSignatures: string[];
  mitigationCommands: { label: string; command: string }[];
  patchInfo: string[];
  pocExists: { exists: boolean; source: string };
  threatActors: string[];
}

export interface CveEnrichedData {
  scoring: CveScoring;
  affectedProducts: AffectedProduct[];
  references: CveReference[];
  enrichedStages: Record<number, EnrichedStage>;
}

export const enrichedData: Record<string, CveEnrichedData> = {
  "CVE-2017-0144": {
    scoring: {
      cvssVector: "AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
      exploitabilityScore: 3.9,
      impactScore: 5.9,
      epssPercentile: 99.9,
      kevDateAdded: "2022-03-25",
      cweName: "Improper Restriction of Operations within the Bounds of a Memory Buffer",
      scoreSource: "NIST",
      lastModified: "2024-07-24",
      alternativeIds: [
        { type: "MS", id: "MS17-010" },
      ],
    },
    affectedProducts: [
      { vendor: "Microsoft", product: "Windows Vista SP2", affectedVersions: "All", fixedVersion: "KB4012598" },
      { vendor: "Microsoft", product: "Windows 7 SP1", affectedVersions: "All", fixedVersion: "KB4012212" },
      { vendor: "Microsoft", product: "Windows 8.1", affectedVersions: "All", fixedVersion: "KB4012213" },
      { vendor: "Microsoft", product: "Windows 10", affectedVersions: "1507, 1511, 1607", fixedVersion: "KB4012606" },
      { vendor: "Microsoft", product: "Windows Server 2008 SP2", affectedVersions: "All", fixedVersion: "KB4012598" },
      { vendor: "Microsoft", product: "Windows Server 2008 R2 SP1", affectedVersions: "All", fixedVersion: "KB4012212" },
      { vendor: "Microsoft", product: "Windows Server 2012", affectedVersions: "All", fixedVersion: "KB4012214" },
      { vendor: "Microsoft", product: "Windows Server 2012 R2", affectedVersions: "All", fixedVersion: "KB4012213" },
      { vendor: "Microsoft", product: "Windows Server 2016", affectedVersions: "All", fixedVersion: "KB4013429" },
      { vendor: "Microsoft", product: "Windows XP SP3 (EOL)", affectedVersions: "All", fixedVersion: "KB4012598 (Emergency)" },
    ],
    references: [
      { url: "https://nvd.nist.gov/vuln/detail/CVE-2017-0144", source: "nvd.nist.gov", tags: ["NVD"] },
      { url: "https://docs.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010", source: "microsoft.com", tags: ["Vendor Advisory", "Patch"] },
      { url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog", source: "cisa.gov", tags: ["KEV Catalog"] },
      { url: "https://www.rapid7.com/db/modules/exploit/windows/smb/ms17_010_eternalblue/", source: "rapid7.com", tags: ["Exploit"] },
      { url: "https://github.com/worawit/MS17-010", source: "github.com", tags: ["PoC", "Exploit"] },
      { url: "https://securelist.com/wannacry-ransomware-used-in-widespread-attacks-all-over-the-world/78351/", source: "securelist.com", tags: ["Analysis"] },
      { url: "https://blog.talosintelligence.com/player-3-has-entered-the-game/", source: "talosintelligence.com", tags: ["Threat Intel"] },
      { url: "https://www.fireeye.com/blog/threat-research/2017/05/wannacry-malware-profile.html", source: "fireeye.com", tags: ["Malware Analysis"] },
    ],
    enrichedStages: {
      1: {
        affectedVersions: "Windows XP through Windows Server 2008 R2",
        exploitMechanics: [
          "Send crafted SMB_COM_NEGOTIATE to target port 445",
          "Trigger buffer overflow in srv.sys via malformed TRANSACTION2 request",
          "Overwrite adjacent kernel pool memory to gain code execution",
          "Achieve SYSTEM-level privileges on target host",
        ],
        rootCauseCode: "srv.sys fails to validate TotalDataCount in SMB_COM_TRANSACTION2_SECONDARY, causing heap buffer overflow in SrvOs2FeaListSizeToNt(). The casting from DWORD to WORD truncates the size value, leading to undersized allocation.",
        attackVector: "Network — Remote, unauthenticated attack via TCP port 445 (SMBv1). No user interaction required. Wormable.",
        detectionSignatures: [],
        mitigationCommands: [],
        patchInfo: [],
        pocExists: { exists: false, source: "" },
        threatActors: ["Equation Group (NSA TAO)"],
      },
      2: {
        affectedVersions: "Windows XP SP3 through Windows Server 2012 R2",
        exploitMechanics: [
          "SMB_COM_TRANSACTION2 request with oversized TotalDataCount",
          "SrvOs2FeaListSizeToNt() casts DWORD to WORD, truncating size",
          "Kernel pool allocation is too small for actual data",
          "Subsequent data copy overflows into adjacent pool allocations",
          "Attacker-controlled data overwrites kernel function pointers",
        ],
        rootCauseCode: "// Vulnerable code path in srv.sys\n// SrvOs2FeaListSizeToNt converts FEA list\n// Bug: DWORD feaListSize cast to WORD\n// If feaListSize > 0xFFFF, truncation occurs\n// Result: pool alloc of (WORD)size, copy of (DWORD)size\n// → heap buffer overflow in kernel space",
        attackVector: "Network — SMBv1 protocol, TCP/445. The overflow occurs in kernel pool memory, giving the attacker Ring 0 code execution.",
        detectionSignatures: [
          "Snort SID 41978 — ET EXPLOIT Possible EternalBlue SMB MS17-010",
          "Snort SID 42329 — ET EXPLOIT Possible EternalBlue Echo Response",
          "YARA rule: rule EternalBlue_Exploit { strings: $s1 = {73 00 6d 00 62} condition: $s1 }",
        ],
        mitigationCommands: [
          { label: "Disable SMBv1 (PowerShell)", command: "Set-SmbServerConfiguration -EnableSMB1Protocol $false" },
          { label: "Block TCP/445 (Windows Firewall)", command: "netsh advfirewall firewall add rule dir=in action=block protocol=TCP localport=445 name=\"Block_SMB\"" },
        ],
        patchInfo: ["MS17-010 (March 2017)", "KB4012212 (Win 7/2008R2)", "KB4012215 (Win 7/2008R2 Monthly)"],
        pocExists: { exists: true, source: "Metasploit module exploit/windows/smb/ms17_010_eternalblue" },
        threatActors: [],
      },
      3: {
        affectedVersions: "All unpatched Windows versions with SMBv1 enabled",
        exploitMechanics: [
          "Shadow Brokers published full exploit code on GitHub",
          "Exploit includes EternalBlue, EternalRomance, EternalSynergy",
          "DoublePulsar backdoor implant included for persistent access",
          "Full exploitation chain from initial access to shell",
        ],
        rootCauseCode: "The leaked archive 'Lost in Translation' contained Python exploit scripts targeting srv.sys. The exploit chain: EternalBlue → DoublePulsar → arbitrary DLL injection into lsass.exe.",
        attackVector: "Public exploit code available — any attacker with network access to port 445 can exploit unpatched systems. No authentication required.",
        detectionSignatures: [
          "Snort SID 42944 — DoublePulsar Backdoor Ping Detection",
          "Snort SID 42340 — SMB EternalBlue Specific Transaction",
          "YARA rule: DoublePulsar_Backdoor — detects implant beacon pattern",
        ],
        mitigationCommands: [
          { label: "Detect DoublePulsar", command: "python detect_doublepulsar.py --target <IP>" },
          { label: "Check for implant (Nmap)", command: "nmap -p 445 --script smb-double-pulsar-backdoor <target>" },
        ],
        patchInfo: ["MS17-010 already released March 14, 2017", "Organizations had 30 days to patch before leak"],
        pocExists: { exists: true, source: "Shadow Brokers public dump — github.com/misterch0c/shadowbroker" },
        threatActors: ["Shadow Brokers"],
      },
      4: {
        affectedVersions: "All unpatched Windows systems globally",
        exploitMechanics: [
          "WannaCry dropper uses EternalBlue to gain initial access",
          "DoublePulsar backdoor injected into lsass.exe",
          "Ransomware payload deployed via backdoor",
          "Worm module scans local subnet + random IPs on port 445",
          "Each infected host becomes a new propagation point",
          "Kill switch: DNS lookup of iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com",
        ],
        rootCauseCode: "// WannaCry propagation logic\n// 1. Scan local /24 subnet on TCP/445\n// 2. Scan random internet IPs on TCP/445\n// 3. For each open port: attempt EternalBlue\n// 4. If successful: inject DoublePulsar\n// 5. Via DoublePulsar: deploy ransomware DLL\n// 6. Encrypt files with RSA-2048 + AES-128-CBC",
        attackVector: "Network worm — self-propagating via SMBv1. No user interaction. Automated lateral movement across network boundaries.",
        detectionSignatures: [
          "YARA rule: WannaCry_Ransomware — detects .WNCRY file extension operations",
          "Snort SID 41978 — SMB EternalBlue exploit attempt",
          "File IOC: tasksche.exe, @WanaDecryptor@.exe",
          "Network IOC: DNS query to kill switch domain",
          "Ransom note file: @Please_Read_Me@.txt",
        ],
        mitigationCommands: [
          { label: "Emergency SMBv1 disable", command: "dism /online /norestart /disable-feature /featurename:SMB1Protocol" },
          { label: "Block at firewall", command: "iptables -A INPUT -p tcp --dport 445 -j DROP" },
          { label: "Register kill switch (sinkhole)", command: "# Register iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com" },
        ],
        patchInfo: ["KB4012598 emergency patch for Windows XP", "KB4012212 for Windows 7", "All MS17-010 patches"],
        pocExists: { exists: true, source: "WannaCry samples widely available — VirusTotal, MalwareBazaar" },
        threatActors: ["Lazarus Group (DPRK)", "Attribution by NSA, FBI, UK NCSC"],
      },
      5: {
        affectedVersions: "N/A — Detection stage",
        exploitMechanics: [
          "Monitor for anomalous SMB traffic volume on TCP/445",
          "Detect DoublePulsar beacon responses",
          "Identify WannaCry file encryption patterns",
          "Monitor for kill switch domain DNS queries",
        ],
        rootCauseCode: "DoublePulsar detection: Send SMB TRANS2 SESSION_SETUP with specific multiplex ID. If response STATUS_NOT_IMPLEMENTED with modified session MID, implant is present. The MID XOR pattern reveals architecture (x86/x64).",
        attackVector: "Detection focuses on network layer (SMB anomalies) and host layer (file system changes, process creation).",
        detectionSignatures: [
          "Snort SID 41978 — ET EXPLOIT Possible EternalBlue",
          "Snort SID 42329 — ET EXPLOIT EternalBlue Echo Response",
          "Snort SID 42944 — DoublePulsar Backdoor Ping",
          "YARA: rule WannaCry { strings: $bitcoin = \"13AM4VW2dhxYgXeQepoHkHSQuy6NgaEb94\" }",
          "Sigma rule: WannaCry Ransomware Activity (proc creation tasksche.exe)",
        ],
        mitigationCommands: [
          { label: "Scan for DoublePulsar", command: "nmap -p 445 --script smb-double-pulsar-backdoor 192.168.1.0/24" },
          { label: "Check SMB signing", command: "Get-SmbServerConfiguration | Select EnableSecuritySignature" },
          { label: "Hunt for WannaCry IOCs", command: "Get-ChildItem -Recurse -Filter *.WNCRY | Select FullName" },
        ],
        patchInfo: [],
        pocExists: { exists: true, source: "Detection tools: doublepulsar-detection-script (GitHub)" },
        threatActors: [],
      },
      6: {
        affectedVersions: "All Windows versions with SMBv1",
        exploitMechanics: [],
        rootCauseCode: "Patch modifies srv.sys to properly validate TotalDataCount field before buffer allocation. The DWORD-to-WORD cast is replaced with proper bounds checking, preventing the heap overflow.",
        attackVector: "N/A — Remediation stage",
        detectionSignatures: [],
        mitigationCommands: [
          { label: "Apply patch (WSUS)", command: "wuauclt /detectnow /updatenow" },
          { label: "Disable SMBv1 permanently", command: "Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force" },
          { label: "Disable SMBv1 (Registry)", command: "reg add \"HKLM\\SYSTEM\\CurrentControlSet\\Services\\LanmanServer\\Parameters\" /v SMB1 /t REG_DWORD /d 0 /f" },
          { label: "Verify patch installed", command: "Get-HotFix -Id KB4012212,KB4012215,KB4012213,KB4012216,KB4013429" },
          { label: "Block SMB at perimeter", command: "netsh advfirewall firewall add rule dir=in action=block protocol=TCP localport=445 name=\"Block_SMB_Perimeter\"" },
        ],
        patchInfo: [
          "MS17-010 — March 14, 2017",
          "KB4012212 — Windows 7 SP1 / Server 2008 R2 (Security Only)",
          "KB4012215 — Windows 7 SP1 / Server 2008 R2 (Monthly Rollup)",
          "KB4012213 — Windows 8.1 / Server 2012 R2 (Security Only)",
          "KB4012216 — Windows 8.1 / Server 2012 R2 (Monthly Rollup)",
          "KB4013429 — Windows 10 v1607 / Server 2016",
          "KB4012606 — Windows 10 v1507",
          "KB4013198 — Windows 10 v1511",
          "KB4012598 — Windows XP / Server 2003 (Emergency EOL patch)",
        ],
        pocExists: { exists: false, source: "" },
        threatActors: [],
      },
    },
  },
};
