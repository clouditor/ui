<script lang="ts">
  import { goto } from '$app/navigation';
  import type { ComplianceStatus } from '$lib/api/evaluation';
  import type { TargetOfEvaluation } from '$lib/api/orchestrator';
  import { Chart, type ChartConfiguration, type ChartData } from 'chart.js/auto';
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let chart: Chart;
  export let compliance: Map<string, ComplianceStatus>;
  export let toe: TargetOfEvaluation;

  let merge = true;

  $: data = buildData(merge);
  $: updateChart(data);

  let config: ChartConfiguration = {
    type: 'doughnut',
    data: buildData(merge),
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
    chart = new Chart(canvas, config);

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

  function updateChart(data: ChartData) {
    if (chart) {
      chart.data = data;
      chart.update();
    }
  }

  function buildData(merge: boolean) {
    if (merge) {
      return {
        labels: ['Non Compliant', 'Compliant', 'Waiting for Data'],
        datasets: [
          {
            label: toe.catalogId,
            data: [
              Array.from(compliance.values()).filter(
                (value) =>
                  value == 'EVALUATION_STATUS_NOT_COMPLIANT' ||
                  value == 'EVALUATION_STATUS_NOT_COMPLIANT_MANUALLY'
              ).length,
              Array.from(compliance.values()).filter(
                (value) =>
                  value == 'EVALUATION_STATUS_COMPLIANT' ||
                  value == 'EVALUATION_STATUS_COMPLIANT_MANUALLY'
              ).length,
              Array.from(compliance.values()).filter(
                (value) => value == 'EVALUATION_STATUS_PENDING'
              ).length
            ],
            backgroundColor: ['#991b1b', '#166534', '#d4d4d4'],
            hoverOffset: 4
          }
        ]
      };
    } else {
      return {
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
              Array.from(compliance.values()).filter(
                (value) => value == 'EVALUATION_STATUS_COMPLIANT'
              ).length,
              Array.from(compliance.values()).filter(
                (value) => value == 'EVALUATION_STATUS_COMPLIANT_MANUALLY'
              ).length,
              Array.from(compliance.values()).filter(
                (value) => value == 'EVALUATION_STATUS_PENDING'
              ).length
            ],
            backgroundColor: ['#991b1b', 'rgb(185 28 28)', '#166534', 'rgb(21 128 61)', '#d4d4d4'],
            hoverOffset: 4
          }
        ]
      };
    }
  }
</script>

<div class="py-3">
  <div class="relative flex items-start mb-2">
    <div class="flex h-6 items-center">
      <input
        id="merge"
        aria-describedby="merge-description"
        name="merge"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-clouditor focus:ring-clouditor"
        bind:checked={merge}
      />
    </div>
    <div class="ml-3 text-sm leading-6">
      <label for="merge" class="font-medium text-gray-900">Merge manual results</label>
      {' '}
      <span id="merge-description" class="text-gray-500">
        <span class="sr-only">Merge manual results </span>
        with automatic results.
      </span>
    </div>
  </div>
  <canvas id="chart" bind:this={canvas} class="h-72 w-72 ml-auto mr-auto" />
</div>
