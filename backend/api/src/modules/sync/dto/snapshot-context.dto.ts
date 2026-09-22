export class SnapshotContext {

    constructor(
        public readonly userId: string,
        public readonly language: string,
        public readonly deviceId: string,
    ) {}

    data: Record<string, any[]> = {};
}