<script lang="ts">
    import { closePopup } from '$lib/components/nav/popup';
    import { CloseLine } from 'svelte-remixicon';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { success, failure } from '$lib/services/alerts.service';

    function handleDrop(event: DragEvent) {
        const items = event.dataTransfer.items;
        const files = event.dataTransfer.files;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === 'file') {
                    let file = items[i].getAsFile();
                    if (
                        file.type === 'image/png' ||
                        file.type === 'image/jpeg' ||
                        file.type === 'image/jpg'
                    ) {
                        success(`file[${i}].name = ${file.name}`);
                    } else {
                        failure(`Unsupported file type '${file.type}'`);
                    }
                }
            }
        } else {
            for (let i = 0; i < files.length; i++) {
                if (
                    files[i].type === 'image/png' ||
                    files[i].type === 'image/jpeg' ||
                    files[i].type === 'image/jpg'
                ) {
                    success(`... file[${i}].name = ${files[i].name}`);
                } else {
                    failure(`Unsupported file type '${files[i].type}'`);
                }
            }
        }
    }
</script>

<div class="upload-container bg-zinc-300 dark:bg-zinc-700">
    <div class="flex items-center border-b-2 border-zinc-500 px-4 py-2 w-full">
        <h3 class="font-medium text-2xl flex-1">Upload Avatar</h3>
        <Button on:click={closePopup}>
            <CloseLine size="20px" class="button-icon no-text" />
        </Button>
    </div>
    <div
        class="w-96 h-48 border-4 border-dashed border-zinc-500 rounded-lg flex flex-col items-center justify-center m-4 mb-0"
        on:drop|preventDefault={(e) => handleDrop(e)}
    >
        <h3 class="font-medium text-2xl">Drag & Drop</h3>
        <span class="text-sm">or click here to pick something awesome</span>
    </div>
</div>

<style lang="scss">
    div.upload-container {
        @apply rounded-lg pb-4;
        box-shadow: var(--dropshadow);
    }
</style>
