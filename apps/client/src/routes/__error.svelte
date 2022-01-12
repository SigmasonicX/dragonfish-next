<script lang="ts">
    import { app } from '$lib/repo/app.repo';
</script>

<div class="empty">
    <h3>{$app.error.title}</h3>
    <p>
        {$app.error.desc}
    </p>
</div>
