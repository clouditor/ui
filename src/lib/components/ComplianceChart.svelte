<script lang="ts">
  import type { TargetOfEvaluation } from '$lib/api/orchestrator';
  import { Chart, type ChartConfiguration } from 'chart.js';
  import { onMount } from 'svelte';

  export let toe: TargetOfEvaluation;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const data = {
      labels: ['Non Compliant', 'Compliant', 'Waiting for Data'],
      datasets: [
        {
          label: 'EUCS',
          data: [Math.random() * 300, Math.random() * 50, Math.random() * 100],
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
</script>

<div class="py-3">
  <canvas id="acquisitions" bind:this={canvas} class="h-72 w-72 ml-auto mr-auto" />
</div>
<div class="flex justify-between gap-x-4 py-3">
  <dt class="text-gray-500">Controls in Scope</dt>
  <dd class="flex items-start gap-x-2">
    <div class="font-medium text-gray-900">{0}</div>
  </dd>
</div>
<div class="flex justify-between gap-x-4 py-3">
  <dt class="text-gray-500">Assurance Level</dt>
  <dd class="flex items-start gap-x-2">
    <div class="font-medium text-gray-900">
      {toe.assuranceLevel ?? '-'}
    </div>
  </dd>
</div>
