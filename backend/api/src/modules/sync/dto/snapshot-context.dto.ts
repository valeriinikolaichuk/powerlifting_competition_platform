export class SnapshotContext {

    constructor(
        public readonly userId: string,
        public readonly language: string,
    ) {}

    data: Record<string, any[]> = {};
}