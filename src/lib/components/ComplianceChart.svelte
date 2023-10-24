<script lang="ts">
  import { goto } from '$app/navigation';
  import type { ComplianceStatus } from '$lib/api/evaluation';
  import type { TargetOfEvaluation } from '$lib/api/orchestrator';
  import { Chart, type ChartConfiguration } from 'chart.js/auto';
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  export let compliance: Map<string, ComplianceStatus>;
  export let toe: TargetOfEvaluation;

  const data = {
    labels: [
      'Non Compliant',
      'Manually set to Non Compliant',
      'Compliant',
      'Manually set to Compliant',
      'Waiting for Data'
    ],
    datasets: [
      {
        label: toe.catalogId,
        data: [
          Array.from(compliance.values()).filter(
            (value) => value == 'EVALUATION_STATUS_NOT_COMPLIANT'
          ).length,
          Array.from(compliance.values()).filter(
            (value) => value == 'EVALUATION_STATUS_NOT_COMPLIANT_MANUALLY'
          ).length,
          Array.from(compliance.values()).filter((value) => value == 'EVALUATION_STATUS_COMPLIANT')
            .length,
          Array.from(compliance.values()).filter(
            (value) => value == 'EVALUATION_STATUS_COMPLIANT_MANUALLY'
          ).length,
          Array.from(compliance.values()).filter((value) => value == 'EVALUATION_STATUS_PENDING')
            .length
        ],
        backgroundColor: ['#991b1b', '#991b1b', '#166534', '#166534', '#d4d4d4'],
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

  onMount(() => {
    let chart = new Chart(canvas, config);

    canvas.onclick = (evt) => {
      const res = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);

      console.log(res);

      if (res.length === 0) {
        return;
      } else {
        goto(
          `/cloud/${toe.cloudServiceId}/compliance/${toe.catalogId}/?status=${data.labels[
            res[0].index
          ].replace(/\s/g, '')}`
        );
      }
    };
  });
</script>

<div class="py-3">
  <canvas id="chart" bind:this={canvas} class="h-72 w-72 ml-auto mr-auto" />
</div>
