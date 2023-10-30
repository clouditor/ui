import { throwError } from './errors';
import { clouditorize } from './util';

export interface GraphEdge {
  id: string
  source: string
  target: string
}

export interface StartDiscoveryResponse {
  successful: boolean
}

export interface QueryResponse {
  results: Resource[]
}

export interface ListGraphEdgesResponse {
  edges: GraphEdge[]
}

export interface ListResourcesRequest {
  filter?: Filter
  orderBy?: string
}

export interface Filter {
  cloudServiceId?: string
  type?: string
}

export interface HttpEndpoint {
  transportEncryption?: TransportEncryption
}

export interface TransportEncryption {
  algorithm: string
  enabled: boolean
  enforced: boolean
  tlsVersion: string
}

export interface ResourceProperties {
  name: string
  raw: string
  type: string[]
  serviceId: string
  id: string
  labels: object
}

export interface Resource {
  id: string
  cloudServiceId: string
  resourceType: string
  properties: ResourceProperties
}

export async function startDiscovery(): Promise<boolean> {
  const apiUrl = clouditorize(`/v1/discovery/start`)

  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.token}`,
    }
  })
    .then((res) => res.json())
    .then((response: StartDiscoveryResponse) => {
      return response.successful;
    });
}

export async function listResources(
  filteredServiceId?: string,
  type = "",
  fetch = window.fetch): Promise<Resource[]> {
  let apiUrl = clouditorize(`/v1/discovery/resources?filter.cloudServiceId=${filteredServiceId}&pageSize=1500&orderBy=resource_type&asc=true
    `);

  if (type != "") {
    apiUrl += `&filter.type=${type}`
  }

  return fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.token}`,
    }
  }).then(throwError)
    .then((res) => res.json())
    .then((response: QueryResponse) => {
      return response.results;
    });
}


export async function listGraphEdges(fetch = window.fetch): Promise<GraphEdge[]> {
  const apiUrl = clouditorize(`/v1experimental/discovery/graph/edges?&pageSize=1500`);

  return fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.token}`,
    }
  }).then(throwError)
    .then((res) => res.json())
    .then((response: ListGraphEdgesResponse) => {
      return response.edges;
    });
}