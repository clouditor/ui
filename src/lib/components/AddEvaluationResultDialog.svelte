<script lang="ts" context="module">
  export interface AddEvaluationResultEvent {
    name: string;
    comment: string;
    validUntil: Date;
    status: ComplianceStatus;
  }
</script>

<script lang="ts">
  import type { ComplianceStatus } from '$lib/api/evaluation';
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot
  } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import ComplianceStatusSelect from './ComplianceStatusSelect.svelte';
  export let open = false;
  let name: string;
  let comment: string;

  const dispatch = createEventDispatcher<{
    addResult: AddEvaluationResultEvent;
  }>();

  interface $$Events {
    addResult: CustomEvent<AddEvaluationResultEvent>;
  }

  function submit() {
    let date = new Date();
    date.setDate(date.getDate() + 30);
    dispatch('addResult', { comment: comment, name: name, validUntil: date, status: status });
    open = false;
  }

  let status: ComplianceStatus = 'EVALUATION_STATUS_COMPLIANT_MANUALLY';
</script>

<TransitionRoot show={open}>
  <Dialog as="div" class="relative z-10" on:close={() => (open = false)}>
    <TransitionChild
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
    </TransitionChild>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          >
            <div>
              <div class="space-y-12">
                <div class="">
                  <DialogTitle class="text-base font-semibold leading-7 text-gray-900">
                    Provide a manual evaluation result
                  </DialogTitle>
                  <p class="mt-1 text-sm leading-6 text-gray-600">
                    Using this form, you can provide a manual evaluation result that will be
                    considered as <ComplianceStatusSelect bind:status />
                  </p>
                  <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div class="sm:col-span-4">
                      <label for="name" class="block text-sm font-medium leading-6 text-gray-900">
                        Name
                      </label>
                      <div class="mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          autocomplete="name"
                          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-clouditor sm:text-sm sm:leading-6"
                          bind:value={name}
                        />
                      </div>
                    </div>

                    <div class="col-span-full">
                      <label for="about" class="block text-sm font-medium leading-6 text-gray-900">
                        Comment
                      </label>
                      <div class="mt-2">
                        <textarea
                          id="about"
                          name="about"
                          rows="3"
                          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-clouditor sm:text-sm sm:leading-6"
                          bind:value={comment}
                        />
                      </div>
                      <p class="mt-3 text-sm leading-6 text-gray-600">
                        Please consider that an auditor will judge the fulfillment of this control
                        based on your comment.
                      </p>
                    </div>

                    <div class="sm:col-span-4">
                      <label
                        for="validity"
                        class="block text-sm font-medium leading-6 text-gray-900">Validity</label
                      >
                      <div class="mt-2">
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autocomplete="given-name"
                          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-clouditor sm:text-sm sm:leading-6"
                          value="1 month"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      class="inline-flex w-full justify-center rounded-md bg-clouditor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clouditor-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clouditor sm:col-start-2"
                      on:click={submit}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      on:click={() => (open = false)}
                      >Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TransitionChild>
      </div>
    </div>
  </Dialog>
</TransitionRoot>
