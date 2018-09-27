/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { FactoryService, IFactoryService } from './resources';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IFactory, IFactoryAction } from './types';
import { IProjectConfig } from '@eclipse-che/workspace-client';
import * as theia from '@theia/plugin';

export class FactoryTheiaManager {
    private static axiosInstance: AxiosInstance = axios;
    private factoryId: string | undefined;

    private factoryService: IFactoryService | undefined;
    private currentFactory: IFactory | undefined;

    constructor(
    ) {
        const factoryIdOrNothing = theia.env.getQueryParameter('factory-id');
        if (!factoryIdOrNothing || typeof factoryIdOrNothing !== 'string') {
            theia.window.showErrorMessage('factory id is empty ....');
            return;
        }
        this.factoryId = factoryIdOrNothing;
    }

    async fetchCurrentFactory(): Promise<IFactory | undefined> {
        if (!this.factoryId) {
            theia.window.showErrorMessage('factory id is empty');
            return undefined;
        }
        theia.window.showInformationMessage('factory-id : ' + this.factoryId);
        if (!this.factoryService) {
            const cheApiInternalVar = await theia.env.getEnvVariable('CHE_API_INTERNAL');
            const cheMachineToken = await theia.env.getEnvVariable('CHE_MACHINE_TOKEN');
            if (!cheApiInternalVar) {
                return undefined;
            }
            this.factoryService = new FactoryService(
                FactoryTheiaManager.axiosInstance,
                cheApiInternalVar,
                cheMachineToken ? { "Authorization": "Bearer " + cheMachineToken } : undefined
            );
        }

        try {
            const response: AxiosResponse<IFactory> = await this.factoryService.getById<IFactory>(this.factoryId);
            if (!response || !response.data) {
                return undefined;
            }

            this.currentFactory = response.data;

            return this.currentFactory;
        } catch(e){
            theia.window.showErrorMessage("Failed to fetch factory definition: "+ e.message);
        }
    }

    getCurrentFactory(): IFactory | undefined {
        return this.currentFactory;
    }

    getFactoryProjects(factory: IFactory | undefined): IProjectConfig[] {
        if (!factory || !factory.workspace || !factory.workspace.projects) {
            return [];
        }

        return factory.workspace.projects;
    }

    getFactoryOnAppLoadedActions(factory: IFactory | undefined): Array<IFactoryAction> {
        if (!factory || !factory.ide || !factory.ide.onAppLoaded || !factory.ide.onAppLoaded.actions) {
            return [];
        }

        return factory.ide.onAppLoaded.actions;
    }

    getFactoryOnProjectsLoadedActions(factory: IFactory | undefined): Array<IFactoryAction> {
        if (!factory || !factory.ide || !factory.ide.onProjectsLoaded || !factory.ide.onProjectsLoaded.actions) {
            return [];
        }

        return factory.ide.onProjectsLoaded.actions;
    }

    getFactoryOnAppClosedActions(factory: IFactory | undefined): Array<IFactoryAction> {
        if (!factory || !factory.ide || !factory.ide.onAppClosed || !factory.ide.onAppClosed.actions) {
            return [];
        }

        return factory.ide.onAppClosed.actions;
    }

}
