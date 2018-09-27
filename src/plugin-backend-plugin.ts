/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { FactoryTheiaClient } from "./factory-theia-client";

export async function start() {

    new FactoryTheiaClient().onStart();
    // get api url
    // fetch factory config -> che namespace + get factory
    // retrieve clone info ->
    // perform clone
    // once all the clone are finish
    // actions
    // open file
    // run task

}

// function getFactoryId() {
//     const factoryIdOrNothing = theia.env.getQueryParameter('factory-id');
//     if (!factoryIdOrNothing || factoryIdOrNothing !== 'string') {
//         theia.window.showErrorMessage('factory id is empty ....on start of backend');
//         return;
//     }
//     theia.window.showInformationMessage("yeah");
// }

export function stop() {

}
