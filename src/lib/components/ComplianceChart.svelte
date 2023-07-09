<script lang="ts">
  import type { ComplianceStatus } from '$lib/api/evaluation';
  import type { TargetOfEvaluation } from '$lib/api/orchestrator';
  import { Chart, type ChartConfiguration } from 'chart.js/auto';
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    let topLevelControls = toe.controlsInScope?.filter((c) => c.parentControlId === undefined);

    const data = {
      labels: ['Non Compliant', 'Compliant', 'Waiting for Data'],
      datasets: [
        {
          label: toe.catalogId,
          data: [
            Array.from(compliance.values()).filter(
              (value) => value == 'EVALUATION_STATUS_NOT_COMPLIANT'
            ).length,
            Array.from(compliance.values()).filter(
              (value) => value == 'EVALUATION_STATUS_COMPLIANT'
            ).length,
            Array.from(compliance.values()).filter((value) => value == 'EVALUATION_STATUS_PENDING')
              .length
          ],
          backgroundColor: ['#991b1b', '#166534', '#d4d4d4'],
          hoverOffset: 4
        }
      ]
    };

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: data,
      options: {
        animation: false,
        plugins: {
          tooltip: {
            titleFont: {
              family: 'Inter var'
            },
            bodyFont: {
              family: 'Inter var'
            },
            footerFont: {
              family: 'Inter var'
            }
          },
          legend: {
            display: false,
            labels: {
              font: {
                family: 'Inter var'
              }
            }
          }
        }
      }
    };

    new Chart(canvas, config);
  });

  export let compliance: Map<string, ComplianceStatus>;
  export let toe: TargetOfEvaluation;
</script>

<div class="py-3">
  <canvas id="acquisitions" bind:this={canvas} class="h-72 w-72 ml-auto mr-auto" />
</div>
