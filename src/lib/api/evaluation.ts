import { clouditorize } from '$lib/api/util';
import { throwError } from './errors';
import type { AuditScope } from './orchestrator';

export interface StartEvaluationResponse {
	succesful: boolean;
}

export interface ListEvaluationResultsResponse {
	results: EvaluationResult[];
}

export type ComplianceStatus =
	| 'EVALUATION_STATUS_NOT_COMPLIANT'
	| 'EVALUATION_STATUS_COMPLIANT'
	| 'EVALUATION_STATUS_COMPLIANT_MANUALLY'
	| 'EVALUATION_STATUS_NOT_COMPLIANT_MANUALLY'
	| 'EVALUATION_STATUS_PENDING'
	| 'EVALUATION_STATUS_DELEGATED';

export interface EvaluationResult {
	id: string;
	cloudServiceId: string;
	status: ComplianceStatus;
	controlCatalogId: string;
	controlCategoryName?: string;
	controlId: string;
	parentControlId?: string;
	timestamp: string;
	failingAssessmentResultIds: string[];
	comment?: string;
	validUntil?: string;
}

export async function startEvaluation(toe: AuditScope): Promise<StartEvaluationResponse> {
	const apiUrl = clouditorize(
		`/v1/evaluation/evaluate/${toe.certificationTargetId}/${toe.catalogId}/start`
	);

	return fetch(apiUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	}).then((res) => res.json());
}

export async function stopEvaluation(toe: AuditScope): Promise<{}> {
	const apiUrl = clouditorize(
		`/v1/evaluation/evaluate/${toe.certificationTargetId}/${toe.catalogId}/stop`
	);

	return fetch(apiUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	}).then((res) => res.json());
}

export interface ListEvaluationResultsFilter {
	cloudServiceId?: string;
	catalogId?: string;
	controlId?: string;
	parentsOnly?: boolean;
}

export async function listEvaluationResults(
	filter?: ListEvaluationResultsFilter,
	latestByControlId = false,
	fetch = window.fetch
): Promise<EvaluationResult[]> {
	let apiUrl = clouditorize(`/v1/evaluation/results?`);

	if (filter?.cloudServiceId != undefined) {
		apiUrl += `&filter.cloud_service_id=${filter?.cloudServiceId}`;
	}
	if (filter?.catalogId != undefined) {
		apiUrl += `&filter.catalog_id=${filter?.catalogId}`;
	}
	if (filter?.controlId != undefined) {
		apiUrl += `&filter.control_id=${filter?.controlId}`;
	}
	if (filter?.parentsOnly != undefined) {
		apiUrl += `&filter.parents_only=${filter?.parentsOnly}`;
	}
	if (latestByControlId) {
		apiUrl += `&latest_by_control_id=true`;
	}

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: ListEvaluationResultsResponse) => {
			return response.results;
		});
}

export async function createEvaluationResult(
	result: EvaluationResult,
	fetch = window.fetch
): Promise<EvaluationResult> {
	const apiUrl = clouditorize(`/v1/evaluation/results`);

	return fetch(apiUrl, {
		method: 'POST',
		body: JSON.stringify(result),
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json());
}
