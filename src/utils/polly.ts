import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { Polly, SynthesizeSpeechInput, VoiceId } from "@aws-sdk/client-polly"
import { getSynthesizeSpeechUrl } from "@aws-sdk/polly-request-presigner"

/**
 * TODO: Convert polly.ts to class & add Vue Composable
 */

// Get environment variables
let settings = window.localStorage.getItem("settings") || "{}"
let item = JSON.parse(settings)

const pollyIdentityPoolId = item?.core?.aws_polly_key || ""
const pollyRegion = pollyIdentityPoolId.split(":")[0]

type PollyAudioParams = {
    rate?: "x-slow" | "slow" | "medium" | "fast" | "x-fast"
    voice?: VoiceId
}

function createClient() {
    // Create the Polly service client
    return new Polly({
        region: pollyRegion,
        credentials: fromCognitoIdentityPool({
            client: new CognitoIdentityClient({ region: pollyRegion }),
            identityPoolId: pollyIdentityPoolId,
        }),
    })
}

export const getPollyAudioUrl = (
    text: string,
    options: PollyAudioParams
): Promise<string> => {
    if (!pollyIdentityPoolId) {
        return Promise.reject()
    }

    const client = createClient()

    const defaultRate = "115%"
    const defaultVoice = "Amy"

    const rate = options?.rate || defaultRate
    const voice = options?.voice || defaultVoice
    const wrappedText = `<speak><prosody rate="${rate}">${text}</prosody></speak>`

    const params: SynthesizeSpeechInput = {
        Text: wrappedText,
        TextType: "ssml",
        VoiceId: voice,
        OutputFormat: "mp3",
        Engine: "neural",
    }

    return getSynthesizeSpeechUrl({
        client,
        params,
    })
}
