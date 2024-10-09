import type {
	AssessmentResult,
	Metric,
	MetricConfiguration,
	MetricImplementation
} from './assessment';
import { throwError } from '$lib/api/errors';
import { clouditorize } from '$lib/api/util';

export interface Runtime {
	releaseVersion: string;
	commitHash: string;
	dependencies: Dependency[];
}

export interface Dependency {
	path: string;
	version: string;
}

export interface Tag {
	tag: object;
}

export interface CertificationTarget {
	id: string;
	name: string;
	description?: string;
	metadata: {
		labels?: Tag[] | string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface AuditScope {
	certificationTargetId: string;
	catalogId: string;
	assuranceLevel?: string;
	controlsInScope?: Control[];
}

export interface ControlInScope {
	auditScopeCertificationTargetId: string;
	auditScopeCatalogId: string;
	controlId: string;
	controlCategoryName: string;
	controlCategoryCatalogId: string;
	monitoringStatus: string;
}

export interface Catalog {
	id: string;
	name: string;
	description: string;
	categories: Category[];
	controls: Control[];
	allInScope: boolean;
	assuranceLevels: string[];
	shortName: string;
	metadata: {
		color: string;
	};
}

export interface Category {
	name: string;
}

export interface Control {
	id: string;
	categoryName?: string;
	categoryCatalogId: string;
	name?: string;
	description?: string;
	controls?: Control[];
	metrics?: Metric[];
	parentControlId?: string;
	assuranceLevel: string;
}

export function controlUrl(control: Control, catalogId: string): string {
	return `${catalogId}/${control.categoryName}/${control.id}`;
}

export function controlUrl2(cis: ControlInScope, catalogId: string): string {
	return `${catalogId}/${cis.controlCategoryName}/${cis.controlId}`;
}

export function parseControlUrl(url: string): [string, string, string?] {
	const parts = url.split('/');

	return [parts[0], parts[1], parts[2]];
}

export interface ListMetricsResponse {
	metrics: Metric[];
}

export interface ListMetricConfigurationsResponse {
	configurations: Map<string, MetricConfiguration>;
}

export interface Certificate {
	id: string;
	name: string;
	certificationTargetId: string;
	issueDate: string;
	expirationDate: string;
	standard: string;
	assuranceLevel: string;
	cab: string;
	description: string;
	states: State[];
}

export interface State {
	state: string;
	treeId: string;
	timestamp: string;
	certificateId: string;
}

export interface ListCatalogsResponse {
	catalogs: Catalog[];
}

export interface ListControlsResponse {
	controls: Control[];
	nextPageToken: string;
}

export interface ListCertificatesResponse {
	certificates: Certificate[];
}

export interface ListAssessmentResultsResponse {
	results: AssessmentResult[];
}

export interface ListCertificationTargetsResponse {
	targets: CertificationTarget[];
}

export interface ListAuditScopesResponse {
	auditScope: AuditScope[];
}

export interface ListControlsInScopeResponse {
	controlsInScope: ControlInScope[];
}

/**
 * Requests the Clouditor runtime information.
 *
 * @returns an array of {@link AssessmentResult}s.
 */
export async function getRuntimeInfo(fetch = window.fetch): Promise<Runtime> {
	const apiUrl = clouditorize(`/v1/orchestrator/runtime_info`);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: Runtime) => {
			return response;
		});
}

/**
 * Requests a list of assessment results from the orchestrator service.
 *
 * @returns an array of {@link AssessmentResult}s.
 */
export async function listAssessmentResults(
	fetch = window.fetch,
	latestByResourceId = false
): Promise<AssessmentResult[]> {
	const apiUrl = clouditorize(
		`/v1/orchestrator/assessment_results?pageSize=1500&latestByResourceId=${latestByResourceId}&orderBy=timestamp&asc=false`
	);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: ListAssessmentResultsResponse) => {
			return response.results;
		});
}

/**
 * Requests a list of assessment results from the orchestrator service.
 *
 * @returns an array of {@link AssessmentResult}s.
 */
export async function listCertificationTargetAssessmentResults(
	serviceId: string,
	fetch = window.fetch
): Promise<AssessmentResult[]> {
	const apiUrl = clouditorize(
		`/v1/orchestrator/assessment_results?pageSize=1000&filter.certificationTargetId=${serviceId}&orderBy=timestamp&asc=false`
	);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: ListAssessmentResultsResponse) => {
			return response.results;
		});
}

/**
 * Retrieves a particular metric from the orchestrator service.
 *
 * @param id the metric id
 * @returns
 */
export async function getMetric(id: string): Promise<Metric> {
	const apiUrl = clouditorize(`/v1/orchestrator/metrics/${id}`);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: Metric) => {
			return response;
		});
}

/**
 * Retrieves a particular metric implementation from the orchestrator service.
 *
 * @param id the metric id
 * @returns
 */
export async function getMetricImplementation(id: string): Promise<MetricImplementation> {
	const apiUrl = clouditorize(`/v1/orchestrator/metrics/${id}/implementation`);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: MetricImplementation) => {
			return response;
		});
}

/**
 * Retrieves a particular metric configuration from the orchestrator service.
 *
 * @param serviceId the Certification Target ID
 * @param metricId the metric id
 * @returns metric configuration
 */
export async function getMetricConfiguration(
	serviceId: string,
	metricId: string
): Promise<MetricConfiguration> {
	const apiUrl = clouditorize(
		`/v1/orchestrator/certification_targets/${serviceId}/metric_configurations/${metricId}`
	);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: MetricConfiguration) => {
			return response;
		});
}

/**
 * Retrieves a particular metric implementation from the orchestrator service.
 *
 * @param id the metric id
 * @returns
 */
export async function listMetricConfigurations(
	serviceId: string,
	skipDefault = false
): Promise<Map<string, MetricConfiguration>> {
	const apiUrl = clouditorize(`/v1/orchestrator/certification_targets/${serviceId}/metric_configurations`);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: ListMetricConfigurationsResponse) => {
			let entries: [string, MetricConfiguration][] = Object.entries(response.configurations);

			if (skipDefault) {
				entries = entries.filter(([, value]) => {
					return !value.isDefault;
				});
			}

			return new Map<string, MetricConfiguration>(entries);
		});
}

/**
 * Creates a new certification target
 */
export async function registerCertificationTarget(service: CertificationTarget): Promise<CertificationTarget> {
	const apiUrl = clouditorize(`/v1/orchestrator/certification_targets`);

	return fetch(apiUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		},
		body: JSON.stringify(service)
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: CertificationTarget) => {
			return response;
		});
}

/**
 * Removes a certification target.
 */
export async function removeCertificationTarget(targetId: string): Promise<void> {
	const apiUrl = clouditorize(`/v1/orchestrator/certification_targets/${targetId}`);

	return fetch(apiUrl, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json());
}

/**
 * Retrieves a list of certification targets from the orchestrator service.
 *
 * @returns an array of {@link CertificationTarget}s.
 */
export async function listCertificationTargets(fetch = window.fetch): Promise<CertificationTarget[]> {
	const apiUrl = clouditorize(`/v1/orchestrator/certification_targets`);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: ListCertificationTargetsResponse) => {
			return response.targets;
		});
}

/**
 * Creates a new target of evaluation.
 */
export async function createAuditScope(
	target: AuditScope
): Promise<AuditScope> {
	const apiUrl = clouditorize(`/v1/orchestrator/audit_scopes`);

	return fetch(apiUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		},
		body: JSON.stringify(target)
	})
		.then(throwError)
		.then((res) => res.json());
}

/**
 * Removes a target of evaluation.
 */
export async function removeAuditScope(
	target: AuditScope
): Promise<AuditScope> {
	const apiUrl = clouditorize(
		`/v1/orchestrator/certification_targets/${target.certificationTargetId}/audit_scopes/${target.catalogId}`
	);

	return fetch(apiUrl, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		},
		body: JSON.stringify(target)
	})
		.then(throwError)
		.then((res) => res.json());
}

/**
 * Adds a control to the scope of a target of evaluation.
 */
export async function addControlToScope(
	scope: ControlInScope,
	fetch = window.fetch
): Promise<ControlInScope> {
	const apiUrl = clouditorize(
		`/v1/orchestrator/certification_targets/${scope.auditScopeCertificationTargetId}/audit_scopes/${scope.auditScopeCatalogId}/controls_in_scope`
	);

	return fetch(apiUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		},
		body: JSON.stringify(scope)
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: ControlInScope) => {
			return response;
		});
}

/**
 * Remove a control from the scope of a target of evaluation.
 */
export async function removeControlFromScope(
	scope: ControlInScope,
	fetch = window.fetch
): Promise<ControlInScope> {
	const apiUrl = clouditorize(
		`/v1/orchestrator/certification_targets/${scope.auditScopeCertificationTargetId}/audit_scopes/${scope.auditScopeCatalogId}/controls_in_scope/categories/${scope.controlCategoryName}/controls/${scope.controlId}`
	);

	return fetch(apiUrl, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json());
}

/**
 * Retrieves a list of targets of evaluation from the orchestrator service.
 *
 * @returns an array of {@link AuditScope}s.
 */
export async function listAuditScopes(
	serviceId: string,
	fetch = window.fetch
): Promise<AuditScope[]> {
	const apiUrl = clouditorize(`/v1/orchestrator/certification_targets/${serviceId}/audit_scopes`);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: ListAuditScopesResponse) => {
			return response.auditScope;
		});
}

/**
 * Retrieves a list of controls in scope of a particular target of evaluation from the orchestrator service.
 *
 * @returns an array of {@link ControlInScope} objects.
 */
export async function listControlsInScope(
	serviceId: string,
	catalogId: string,
	fetch = window.fetch
): Promise<ControlInScope[]> {
	const apiUrl = clouditorize(
		`/v1/orchestrator/certification_targets/${serviceId}/audit_scopes/${catalogId}/controls_in_scope?pageSize=1500&orderBy=control_id&asc=true`
	);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: ListControlsInScopeResponse) => {
			return response.controlsInScope;
		});
}

/**
 * Retrieves a list of catalogs from the orchestrator service.
 *
 * @returns an array of {@link Catalog}s.
 */
export async function listCatalogs(fetch = window.fetch): Promise<Catalog[]> {
	const apiUrl = clouditorize(`/v1/orchestrator/catalogs`);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: ListCatalogsResponse) => {
			return response.catalogs;
		});
}

/**
 * Retrieves a catalog from the orchestrator service.
 *
 * @returns a {@link Catalog}s.
 */
export async function getCatalog(id: string, fetch = window.fetch): Promise<Catalog> {
	const apiUrl = clouditorize(`/v1/orchestrator/catalogs/${id}`);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json());
}

/**
 * Retrieves controls from the orchestrator service.
 *
 * @returns a list of {@link Control}s.
 */
export async function listControls(
	catalogId?: string,
	categoryName?: string,
	fetch = window.fetch
): Promise<Control[]> {
	let baseApiUrl: string;
	if (catalogId != null && categoryName != null) {
		baseApiUrl = clouditorize(
			`/v1/orchestrator/catalogs/${catalogId}/categories/${categoryName}/controls?pageSize=1500&orderBy=id&asc=true`
		);
	} else {
		baseApiUrl = clouditorize(`/v1/orchestrator/controls?pageSize=1500&orderBy=id&asc=true`);
	}

	const controls: Control[] = [];
	let nextPageToken = undefined;
	do {
		let apiUrl = baseApiUrl;
		if (nextPageToken != undefined) {
			apiUrl = apiUrl + '&pageToken=' + nextPageToken;
		}

		const res = (await throwError(
			await fetch(apiUrl, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.token}`
				}
			})
		).json()) as ListControlsResponse;

		controls.push(...res.controls);
		nextPageToken = res.nextPageToken;
	} while (nextPageToken != '' && nextPageToken !== undefined && nextPageToken !== null);

	return controls;
}

/**
 * Retrieve a certification target from the orchestrator service using its ID.
 *
 * @returns the certification target
 */
export async function getCertificationTarget(id: string, fetch = window.fetch): Promise<CertificationTarget> {
	const apiUrl = clouditorize(`/v1/orchestrator/certification_targets/${id}`);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json());
}

export async function updateCertificationTarget(
	service: CertificationTarget,
	fetch = window.fetch
): Promise<CertificationTarget> {
	const apiUrl = clouditorize(`/v1/orchestrator/certification_targets/${service.id}`);

	return fetch(apiUrl, {
		method: 'PUT',
		body: JSON.stringify(service),
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: CertificationTarget) => {
			return response;
		});
}

export async function updateControlInScope(
	scope: ControlInScope,
	fetch = window.fetch
): Promise<CertificationTarget> {
	const apiUrl = clouditorize(
		`/v1/orchestrator/certification_targets/${scope.auditScopeCertificationTargetId}/audit_scopes/${scope.auditScopeCatalogId}/controls_in_scope/categories/${scope.controlCategoryName}/controls/${scope.controlId}`
	);

	return fetch(apiUrl, {
		method: 'PUT',
		body: JSON.stringify(scope),
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: CertificationTarget) => {
			return response;
		});
}

/**
 * Retrieves a list of metrics from the orchestrator service.
 *
 * @returns an array of {@link Metric}s.
 */
export async function listMetrics(fetch = window.fetch): Promise<Metric[]> {
	const apiUrl = clouditorize(`/v1/orchestrator/metrics?pageSize=200`);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: ListMetricsResponse) => {
			return response.metrics;
		});
}

/**
 * Retrieves a list of certificates from the orchestrator service.
 *
 * @returns an array of {@link Certificate}s.
 */
export async function listCertificates(): Promise<Certificate[]> {
	const apiUrl = clouditorize(`/v1/orchestrator/certificates`);

	return fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.token}`
		}
	})
		.then(throwError)
		.then((res) => res.json())
		.then((response: ListCertificatesResponse) => {
			return response.certificates;
		});
}
