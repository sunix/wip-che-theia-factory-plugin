/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { IProjectConfig } from '@eclipse-che/workspace-client';
import { FactoryTheiaManager } from './factory-manager';
import * as theia from '@theia/plugin';

/**
 * Enumeration ID's of ide actions.
 */
export enum ActionId {
    OPEN_FILE = 'openFile',
    RUN_COMMAND = 'runCommand'
}

/**
 * Provides basic Eclipse Che factory client side features at startup of the Theia browser IDE:
 * - checking/retrieving factory-id from URL
 * - request che factory api to get the factory definition
 * - clone the projects defined in the factory definition
 * - checkout branch if needed
 */
export class FactoryTheiaClient {

    private projectsRoot: string = '/projects';

    // private onAppClosedActions: IFactoryAction[] = [];
    // private onAppLoadedActions: IFactoryAction[] = [];

    private readonly factoryManager: FactoryTheiaManager;

    constructor() {
        this.factoryManager = new FactoryTheiaManager();
    }

    async onStart() {
        const factory = await this.factoryManager.fetchCurrentFactory();
        if (!factory) {
            return;
        }

        console.info("Che Factory setup ...");
        const projectsRootEnvVar = await theia.env.getEnvVariable('CHE_PROJECTS_ROOT');
        if (projectsRootEnvVar) {
            this.projectsRoot = projectsRootEnvVar;
        }

        // this.onAppClosedActions = this.factoryManager.getFactoryOnAppClosedActions(factory);
        // this.onAppLoadedActions = this.factoryManager.getFactoryOnAppLoadedActions(factory);

        // const onProjectsLoadedActions = this.factoryManager.getFactoryOnProjectsLoadedActions(factory);
        // const importProjectPromises: Array<Promise<void>> = [];

        const projects = this.factoryManager.getFactoryProjects(factory);
        projects.forEach((project: IProjectConfig) => {
            if (!project.source) {
                return;
            }

            const source = project.source;
            const projectPath = this.projectsRoot + project.path;

            theia.window.showInformationMessage(`Cloning ... ${source.location} to ${projectPath}...`);
        });

    }
}
