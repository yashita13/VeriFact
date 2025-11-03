// frontend/lib/types.ts

export type Decision =
    | "True"
    | "False"
    | "Misleading"
    | "Unverifiable"
    | "Error";

export interface ClaimBreakdown {
    sub_claim: string;
    status: "Supported" | "Refuted" | "Contradicted" | "Unverifiable";
    evidence: string;
    source_url?: string;
    reason_for_decision: string;
}

export interface Explanation {
    claim_breakdown: ClaimBreakdown[];
    explanation: string;
    corrected_news?: string;
    explanatory_tag?: string;
    misinformation_techniques?: string[];
}

export interface WebResult {
    title: string;
    url: string;
}

export interface AnalysisResponse {
    summary?: string;
    final_verdict?: {
        decision?: Decision;
        fake_score?: number;
        reasoning?: string;
    };
    explanation?: Partial<Explanation>;
    web_results?: WebResult[];
    fact_check_api?: any[];
    error?: string;
    detail?: any;
}
