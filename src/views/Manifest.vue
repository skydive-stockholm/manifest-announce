<script setup lang="ts">
import { onUnmounted, ref } from "vue"
import { isPlayingSound, play } from "../utils/sound.ts"
import BaseButton from "../components/BaseButton.vue"
import AlertComponent from "../components/AlertComponent.vue"
import { useSkyview } from "../composables/useSkyview.ts"
import CoreSwitch from "../components/BaseSwitch.vue"
import CustomMessageAnnouncement from "./CustomMessageAnnouncement.vue"
import { useLocalStorage } from "@vueuse/core"
import GateSelect from "./GateSelect.vue"
import SettingsDialog from "./SettingsDialog.vue"
import { useGlobalState } from "../store/store.ts"

const state = useGlobalState()
const SkyviewService = useSkyview()
const skyview = SkyviewService.skyview

const readNames = useLocalStorage("readNames", true)

const announce10MinuteCall = () => {
    const gate = state.value.selectedGate
    return play(
        `This is a 10 minute call. Time to go to loading area. ${gate ? gate + " gate." : ""} 10 minutes.`,
        true
    )
}

const announce15MinuteCall = async () => {
    const nextLoad = skyview.value.getNextLoad()

    if (!nextLoad) {
        return
    }

    let msg = `This is a 15 minute call for load number ${nextLoad.loadNo}. `

    if (readNames.value) {
        const names = nextLoad.stringifyJumpers()
        msg += `On this load we have; ${names}. `
    }

    const fellingLeader = nextLoad?.fellingLeader()

    if (fellingLeader) {
        msg += `Load master is ${fellingLeader.name}. `
    }

    if (state.value.selectedGate) {
        msg += `${state.value.selectedGate} gate... `
    }

    if (readNames.value || fellingLeader) {
        msg += "15 minutes. "
    }

    await play(msg, true)
}

const autoCall = ref(false)
const lastAnnounced10MinuteLoad = ref(null)
const lastAnnounced15MinuteLoad = ref(null)
const autoLoadLoop = async () => {
    if (!autoCall.value) return

    const nextLoad = skyview.value.getNextLoad()

    if (!nextLoad) {
        return
    }

    const minutesToNextLoad = skyview.value.getNextLoadMinutes()

    // 10 minute call
    if (minutesToNextLoad === 10) {
        if (lastAnnounced10MinuteLoad.value === nextLoad.loadNo) return
        lastAnnounced10MinuteLoad.value = nextLoad.loadNo

        await announce10MinuteCall()
    }

    // 15 minute call
    if (minutesToNextLoad === 14 || minutesToNextLoad === 15) {
        if (lastAnnounced15MinuteLoad.value === nextLoad.loadNo) return
        lastAnnounced15MinuteLoad.value = nextLoad.loadNo

        await announce15MinuteCall()
    }
}

const loop = setInterval(autoLoadLoop, 2 * 1000)

onUnmounted(() => clearInterval(loop))

const settingsDialog = ref(null)
const settings = ref(null)
</script>

<template>
    <SettingsDialog
        @update:model-value="settings = $event"
        ref="settingsDialog"
    />

    <AlertComponent v-if="!state.selectedGate" class="mb-20">
        No gate has been selected
    </AlertComponent>

    <div class="flex flex-col lg:flex-row gap-12">
        <div class="flex flex-col gap-8">
            <div>
                <div class="flex gap-10 mb-8">
                    <CoreSwitch
                        v-model="autoCall"
                        label="Auto call"
                        v-tooltip="
                            'Automatically announce 10 and 15 minute calls'
                        "
                    />

                    <CoreSwitch v-model="readNames" label="Read names" />

                    <GateSelect />

                    <div>
                        <label
                            class="dark:text-gray-400 uppercase text-xs font-semibold mb-1 flex gap-1"
                        >
                            Settings
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-4 text-gray-600"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                                />
                            </svg>
                        </label>

                        <button
                            class="text-blue-500 hover:text-blue-700"
                            @click="settingsDialog.reveal()"
                        >
                            Edit
                        </button>
                    </div>
                </div>

                <div class="flex gap-10 mt-2">
                    <div>
                        <label
                            class="dark:text-gray-400 block uppercase text-xs font-semibold mb-1"
                        >
                            <span class="flex-shrink-0"
                                >Load
                                <template v-if="skyview.getNextLoad()"
                                    >#{{
                                        skyview.getNextLoad().loadNo
                                    }}</template
                                ></span
                            >

                            <span
                                v-if="skyview.getNextLoad()"
                                class="inline-flex relative h-3 w-3 ml-1 visible"
                            >
                                <span
                                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"
                                ></span>
                                <span
                                    class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"
                                ></span>
                            </span>
                        </label>

                        <div class="dark:text-gray-200 font-medium">
                            <strong
                                v-if="skyview.getNextLoad()"
                                :class="{
                                    'text-green-500':
                                        skyview.getNextLoadMinutes() >= 10,
                                    'text-yellow-500':
                                        skyview.getNextLoadMinutes() >= 5 &&
                                        skyview.getNextLoadMinutes() < 10,
                                    'text-red-500':
                                        skyview.getNextLoadMinutes() < 5,
                                }"
                            >
                                {{ skyview.getNextLoadMinutes() }}m
                            </strong>
                            <small v-else>No load, yet</small>
                        </div>
                    </div>

                    <div>
                        <label
                            class="dark:text-gray-400 block uppercase text-xs font-semibold mb-1"
                            v-tooltip="'Number of jumpers in queue'"
                            >Slots left</label
                        >
                        <div
                            v-if="skyview.getNextLoad()"
                            class="dark:text-gray-200 font-medium"
                        >
                            {{ skyview.getNextLoad().slotsAvailable }}
                        </div>
                    </div>

                    <div>
                        <label
                            class="dark:text-gray-400 block uppercase text-xs font-semibold mb-1"
                            v-tooltip="'Number of jumpers in queue'"
                        >
                            Weight left
                        </label>
                        <div
                            v-if="skyview.getNextLoad()"
                            class="dark:text-gray-200 font-medium"
                        >
                            {{
                                skyview.getNextLoad()?.maxWeight -
                                skyview.getNextLoad()?.getTotalWeight()
                            }}
                            kg
                        </div>
                    </div>

                    <div>
                        <label
                            class="dark:text-gray-400 block uppercase text-xs font-semibold mb-1"
                            >Load master</label
                        >
                        <div
                            class="dark:text-gray-200 font-medium"
                            v-if="skyview.loads.length"
                        >
                            <template
                                v-if="skyview.getNextLoad().fellingLeader()"
                            >
                                {{ skyview.getNextLoad().fellingLeader().name }}
                            </template>
                            <template v-else> N/A</template>
                        </div>
                    </div>

                    <div>
                        <label
                            class="dark:text-gray-400 block uppercase text-xs font-semibold mb-1"
                            v-tooltip="'Number of jumpers in queue'"
                            >In queue</label
                        >
                        <div class="dark:text-gray-200 font-medium">
                            {{ skyview.jumpQueueCount }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex gap-4 flex-wrap">
                <div>
                    <BaseButton
                        color="green"
                        id="minutes-15"
                        tabindex="-1"
                        @dblclick="announce15MinuteCall"
                        :disabled="isPlayingSound"
                    >
                        15 minute call
                    </BaseButton>
                </div>

                <div>
                    <BaseButton
                        color="yellow"
                        id="minutes-10"
                        tabindex="-1"
                        :disabled="isPlayingSound"
                        @dblclick="announce10MinuteCall"
                    >
                        10 minute call
                    </BaseButton>
                </div>

                <div>
                    <BaseButton
                        color="red"
                        id="minutes-10"
                        tabindex="-1"
                        :disabled="isPlayingSound"
                        @dblclick="play(`Standby. Standby.`, true)"
                    >
                        Standby
                    </BaseButton>
                </div>
            </div>
        </div>

        <CustomMessageAnnouncement />
    </div>
</template>
