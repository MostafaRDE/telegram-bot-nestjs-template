import { Module } from '@nestjs/common'
import { externalsImportsAppModule } from './app/imports/externals.import'
import { internalsImportsAppModule } from './app/imports/internals.import'

@Module({
    imports: [
        ...externalsImportsAppModule,
        ...internalsImportsAppModule,
    ],
})
export class AppModule {}
