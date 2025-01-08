import { getMinutesDiff } from "../utils/date.ts"

const LoadStatus = {
    PLANNED: 1,
    LOADED: 2,
    LIFTED: 3,
    DROPPED: 4,
    LANDED: 5,
    fromString: (status: string): number | null => {
        const map: { [key: string]: number } = {
            Planned: 1,
            Loaded: 2,
            Lifted: 3,
            Dropped: 4,
            Landed: 5,
        }
        return map[status] || null
    },
} as const

type MemberData = {
    name: string
    memberNo: string
    emailAddress: string
    gender?: string
    memberWeight?: {
        weight: number | null
    }
}

type LoadJumperData = {
    altitude: number
    altitudeUnit: string
    jumpNo: number
    jumptype: string
    jumptypeName: string
    member?: MemberData
    price: number
    weight: number
    reported: boolean
    debInternalNo: string
    groupNo?: number
    comment?: string
    studentJumpNo?: number
    childType?: string
    children?: LoadJumperData[]
}

type LoadGroupData = {
    groupName: string
    groupNo: number
    groupNoNullSafe: number
    icon: string
    id: string
    loadExitOrder: number
    numberOfJumpers: number
    skyText: string
    text: string
    timeForRequest: string
    computername: string
    slotCounter: number
    childType: string
    children: LoadJumperData[]
}

type LoadData = {
    loadNo: number
    planeReg: string
    loadStatusName: string
    loadStatus?: number
    liftTime: string
    liftedAt: string
    slotsAvailable: number
    maxPass: number
    maxWeight: number
    location: string
    comment?: string
    fellingLeaders: Array<{ member: MemberData }>
    pilots: Array<{ member: MemberData }>
    jumpLeaders: Array<{ member: MemberData }>
    boogieName?: string
    boogieNo?: number
    children: Array<LoadJumperData | LoadGroupData>
}

type ManifestData = {
    jumpDate: string
    clubName: string
    location: string
    jumpQueueCount: number
    loads: LoadData[]
}

class Member {
    readonly name: string
    readonly memberNo: string
    readonly emailAddress: string
    readonly gender: string | null
    readonly memberWeight: number | null

    constructor(data: MemberData) {
        this.name = data.name
        this.memberNo = data.memberNo
        this.emailAddress = data.emailAddress
        this.gender = data.gender || null
        this.memberWeight = data.memberWeight?.weight || null
    }

    firstName(): string {
        return this.name.split(" ")[0]
    }

    toString(): string {
        return this.name
    }
}

class LoadJumper {
    readonly altitude: number
    readonly altitudeUnit: string
    readonly jumpNo: number
    readonly jumptype: string
    readonly jumptypeName: string
    readonly member: Member | null
    readonly price: number
    readonly weight: number
    readonly reported: boolean
    readonly debInternalNo: string
    readonly groupNo: number | null
    readonly comment: string | undefined
    readonly studentJumpNo: number | undefined
    readonly load: Load
    readonly group: LoadGroup | null

    constructor(
        data: LoadJumperData,
        load: Load,
        group: LoadGroup | null = null
    ) {
        this.altitude = data.altitude
        this.altitudeUnit = data.altitudeUnit
        this.jumpNo = data.jumpNo
        this.jumptype = data.jumptype
        this.jumptypeName = data.jumptypeName
        this.member = data.member ? new Member(data.member) : null
        this.price = data.price
        this.weight = data.weight
        this.reported = data.reported
        this.debInternalNo = data.debInternalNo
        this.groupNo = data.groupNo || null
        this.comment = data.comment
        this.studentJumpNo = data.studentJumpNo
        this.load = load
        this.group = group
    }

    toString(): string {
        return `${this.member?.toString()} - ${this.altitude}${
            this.altitudeUnit
        } ${this.jumptypeName}`
    }
}

class LoadGroup {
    readonly groupName: string
    readonly groupNo: number
    readonly groupNoNullSafe: number
    readonly icon: string
    readonly id: string
    readonly loadExitOrder: number
    readonly numberOfJumpers: number
    readonly skyText: string
    readonly text: string
    readonly timeForRequest: string
    readonly computername: string
    readonly slotCounter: number
    readonly load: Load
    readonly children: LoadJumper[]

    constructor(data: LoadGroupData, load: Load) {
        this.groupName = data.groupName
        this.groupNo = data.groupNo
        this.groupNoNullSafe = data.groupNoNullSafe
        this.icon = data.icon
        this.id = data.id
        this.loadExitOrder = data.loadExitOrder
        this.numberOfJumpers = data.numberOfJumpers
        this.skyText = data.skyText
        this.text = data.text
        this.timeForRequest = data.timeForRequest
        this.computername = data.computername
        this.slotCounter = data.slotCounter
        this.load = load
        this.children = data.children.map(
            (c) => new LoadJumper(c, this.load, this)
        )
    }
}

class Load {
    readonly loadNo: number
    readonly planeReg: string
    readonly loadStatus: number
    readonly loadStatusName: string
    readonly liftTime: string
    readonly liftedAt: string
    readonly maxPass: number
    readonly maxWeight: number
    readonly location: string
    readonly slotsAvailable: number | null
    readonly comment: string | undefined
    readonly fellingLeaders: Member[]
    readonly groups: LoadGroup[]
    readonly jumpers: LoadJumper[]
    readonly children: Array<LoadJumper | LoadGroup>
    readonly pilots: Member[]
    readonly jumpLeaders: Member[]
    readonly boogieName: string | undefined
    readonly boogieNo: number | undefined

    constructor(data: LoadData) {
        this.loadNo = data.loadNo
        this.planeReg = data.planeReg
        this.loadStatus =
            LoadStatus.fromString(data.loadStatusName) || data.loadStatus || 0
        this.loadStatusName = data.loadStatusName
        this.liftTime = data.liftTime
        this.liftedAt = data.liftedAt
        this.slotsAvailable = data.slotsAvailable
        this.maxPass = data.maxPass
        this.maxWeight = data.maxWeight
        this.location = data.location
        this.comment = data.comment
        this.fellingLeaders = data.fellingLeaders.map(
            (f) => new Member(f.member)
        )
        this.groups = []
        this.jumpers = []
        this.children = []
        data.children.forEach((child) => {
            if ((child as LoadJumperData).childType === "Jump") {
                const loadJumper = new LoadJumper(child as LoadJumperData, this)
                this.children.push(loadJumper)
                this.jumpers.push(loadJumper)
            }

            if ((child as LoadGroupData).childType === "Group") {
                const loadGroup = new LoadGroup(child as LoadGroupData, this)
                this.groups.push(loadGroup)
                this.children.push(loadGroup)

                loadGroup.children.forEach((groupChild) => {
                    this.jumpers.push(groupChild)
                })
            }
        })
        this.pilots = data.pilots.map((p) => new Member(p.member))
        this.jumpLeaders = data.jumpLeaders.map((jl) => new Member(jl.member))
        this.boogieName = data.boogieName
        this.boogieNo = data.boogieNo
    }

    fellingLeader(): Member | undefined {
        return this.fellingLeaders[0]
    }

    getJumpersByType(jumptype: string): LoadJumper[] {
        return this.jumpers.filter((jumper) => jumper.jumptype === jumptype)
    }

    getTotalWeight(): number {
        return this.jumpers.reduce((sum, jumper) => sum + jumper.weight, 0)
    }

    hasAvailableSlots(): boolean {
        return this.jumpers.length < this.maxPass
    }

    getAvailableSlots(): number {
        return this.maxPass - this.jumpers.length
    }

    isWeightAvailable(additionalWeight: number): boolean {
        return this.getTotalWeight() + additionalWeight <= this.maxWeight
    }

    stringifyJumpers(): string {
        let names = ""

        if (!this.jumpers.length) return ""

        this.children.forEach((group) => {
            if (group instanceof LoadGroup) {
                // Group with a name
                names += group.groupName + ". "
            } else if (group instanceof LoadJumper) {
                // Solo jumper
                names += group.member?.firstName() + ". "
            }
        })

        return names
    }

    toString(): string {
        return `${this.planeReg} #${this.loadNo} [${this.loadStatusName}] ${this.jumpers.length}/${this.maxPass}`
    }
}

export default class Skyview {
    readonly jumpDate: string | undefined
    readonly clubName: string | undefined
    readonly location: string | undefined
    readonly jumpQueueCount: number | undefined
    readonly loads: Load[]

    constructor(manifestData: ManifestData | null = null) {
        this.jumpDate = manifestData?.jumpDate
        this.clubName = manifestData?.clubName
        this.location = manifestData?.location
        this.jumpQueueCount = manifestData?.jumpQueueCount
        this.loads = manifestData?.loads.map((load) => new Load(load)) || []
    }

    getJumpers(): LoadJumper[] {
        return this.loads.flatMap((load) => load.jumpers)
    }

    getLoadsByStatus(status: number): Load[] {
        return this.loads.filter((load) => load.loadStatus === status)
    }

    getNextLoad(): Load {
        return this.getPlannedLoads().sort(
            (a, b) =>
                new Date(a.liftTime).getTime() - new Date(b.liftTime).getTime()
        )[0]
    }

    getNextLoadMinutes(): number {
        const nextLoad = this.getNextLoad()

        if (!nextLoad) return 0

        return getMinutesDiff(new Date(), new Date(nextLoad.liftedAt))
    }

    findJumperByMemberNo(memberNo: string): LoadJumper | undefined {
        return this.loads
            .flatMap((load) => load.jumpers)
            .find((jumper) => jumper.member?.memberNo === memberNo)
    }

    getLoadsByJumpType(jumptype: string): Load[] {
        return this.loads.filter((load) =>
            load.jumpers.some((jumper) => jumper.jumptype === jumptype)
        )
    }

    getPlannedLoads(): Load[] {
        return this.getLoadsByStatus(LoadStatus.PLANNED)
    }

    getLandedLoads(): Load[] {
        return this.getLoadsByStatus(LoadStatus.LANDED)
    }
}
