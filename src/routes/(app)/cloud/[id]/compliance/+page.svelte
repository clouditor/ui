<script lang="ts">
  import Chart, { type ChartConfiguration } from 'chart.js/auto';
  import { onMount } from 'svelte';

  let canvases: HTMLCanvasElement[] = [];

  onMount(() => {
    for (let i = 0; i < clients.length; i++) {
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

      new Chart(canvases[i], config);
    }
  });

  const clients = [
    {
      id: 1,
      name: 'EUCS'
    },
    {
      id: 2,
      name: 'BSI C5'
    },
    {
      id: 3,
      name: 'Clouditor Demo Catalog'
    }
  ];
</script>

<ul class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
  {#each clients as client, i (client.id)}
    <li class="overflow-hidden rounded-xl border border-gray-200">
      <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
        <div class="text-sm font-medium leading-6 text-gray-900">{client.name}</div>
      </div>
      <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div class="py-3">
          <canvas id="acquisitions" bind:this={canvases[i]} class="h-72 w-72 ml-auto mr-auto" />
        </div>
        <div class="flex justify-between gap-x-4 py-3">
          <dt class="text-gray-500">Assurance Level</dt>
          <dd class="flex items-start gap-x-2">
            <div class="font-medium text-gray-900">High</div>
          </dd>
        </div>
      </dl>
    </li>
  {/each}
</ul>
