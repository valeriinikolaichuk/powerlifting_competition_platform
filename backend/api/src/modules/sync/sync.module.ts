import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { SyncGateway } from './sync.gateway';

import { PrismaService } from '../prisma/prisma.service';
import { SyncOutboxDeliveryService } from './sync-outbox-delivery.service';
import { SyncProcessorService } from './sync-processor.service';

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
import { SyncInboxService } from './sync-inbox.service';
import { SyncOutboxService } from './sync-outbox.service';

import { SYNC_OPERATIONS } from './sync.tokens';
import { SyncOperationFactoryService } from './sync-operations/sync-operation-factory.service';

@Module({
  controllers: [SyncController],
  providers: [
    PrismaService, 
    SyncOutboxDeliveryService, 
    SyncProcessorService, 

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

    SnapshotPipelineService,
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

  // iterable<SyncOperationInterface>
//    CreateCompetitionOperation,
//    UpdateCompetitionOperation,
//    DeleteCompetitionOperation,

    SyncOperationFactoryService,
    {
      provide: SYNC_OPERATIONS,
      useFactory: (
//        createCompetition: CreateCompetitionOperation,
//        updateCompetition: UpdateCompetitionOperation,
//        deleteCompetition: DeleteCompetitionOperation,
      ) => [
//        createCompetition,
//        updateCompetition,
//        deleteCompetition,
      ],
      inject: [
//        CreateCompetitionOperation,
//        UpdateCompetitionOperation,
//        DeleteCompetitionOperation,
      ],
    },

    SyncService, 
    SyncGateway, 
    SyncInboxService, 
    SyncOutboxService,
  ],
})
export class SyncModule {}