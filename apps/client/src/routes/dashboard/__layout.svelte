<script lang="ts">
    import { Dashboard2Line } from 'svelte-remixicon';
    import PageNav from '$lib/components/nav/PageNav.svelte';
</script>

<div class="flex w-full h-screen">
    <PageNav>
        <svelte:fragment slot="header">
            <h3>Dashboard</h3>
            <Dashboard2Line />
        </svelte:fragment>
    </PageNav>
</div>
