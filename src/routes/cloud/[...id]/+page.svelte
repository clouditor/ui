<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

{data.service.name} with {data.statistics.discoveredResources} discovered resources
