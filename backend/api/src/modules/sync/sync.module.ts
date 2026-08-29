import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { SyncGateway } from './sync.gateway';

import { SNAPSHOT_PIPELINE } from './sync.tokens';

import { SnapshotPipelineService } from './snapshot-pipeline/snapshot-pipeline.service';
import { StaticReferenceStep } from './snapshot-pipeline/static-reference-step';
import { AdminReferenceStep } from './snapshot-pipeline/admin-reference-step';
import { UserReferenceStep } from './snapshot-pipeline/user-reference-step';
import { UserReferenceFederationsStep } from './snapshot-pipeline/user-reference-federations-step';
import { CompetitionStep } from './snapshot-pipeline/competition-step';
import { CompetitionSessionStep } from './snapshot-pipeline/competition-session-step';
import { CompetitionGroupStep } from './snapshot-pipeline/competition-group-step';
import { UserStep } from './snapshot-pipeline/user-step';
import { CreatedByUserStep } from './snapshot-pipeline/created-by-user-step';
import { CompetitionRuntimeStep } from './snapshot-pipeline/competition-runtime-step';
import { OrganizationResultStep } from './snapshot-pipeline/organization-result-step';

@Module({
  controllers: [SyncController],
  providers: [

  // iterable<SnapshotStepInterface>
    StaticReferenceStep, 
    AdminReferenceStep, 
    UserReferenceStep, 
    UserReferenceFederationsStep, 
    CompetitionStep, 
    CompetitionSessionStep, 
    CompetitionGroupStep, 
    UserStep, 
    CreatedByUserStep, 
    CompetitionRuntimeStep, 
    OrganizationResultStep, 

    {
      provide: SNAPSHOT_PIPELINE,
      useFactory: (
        staticReference: StaticReferenceStep,
        adminReference: AdminReferenceStep, 
        userReference: UserReferenceStep, 
        userReferenceFederations: UserReferenceFederationsStep, 
        competition: CompetitionStep, 
        competitionSession: CompetitionSessionStep, 
        competitionGroup: CompetitionGroupStep, 
        user: UserStep, 
        createdByUser: CreatedByUserStep, 
        competitionRuntime: CompetitionRuntimeStep, 
        organizationResult: OrganizationResultStep, 
      ) => [
        staticReference,
        adminReference, 
        userReference, 
        userReferenceFederations, 
        competition, 
        competitionSession, 
        competitionGroup, 
        user, 
        createdByUser, 
        competitionRuntime, 
        organizationResult, 
      ],
      inject: [
        StaticReferenceStep, 
        AdminReferenceStep, 
        UserReferenceStep, 
        UserReferenceFederationsStep, 
        CompetitionStep, 
        CompetitionSessionStep, 
        CompetitionGroupStep, 
        UserStep, 
        CreatedByUserStep, 
        CompetitionRuntimeStep, 
        OrganizationResultStep, 
      ],
    },

    SnapshotPipelineService,

    SyncService, 
    SyncGateway,
  ],
})
export class SyncModule {}