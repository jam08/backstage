/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { EntityPolicy } from '@backstage/catalog-model';
import * as result from './results';
import {
  LocationProcessor,
  LocationProcessorResult,
  LocationProcessorEmit,
} from './types';

export class EntityPolicyProcessor implements LocationProcessor {
  private readonly policy: EntityPolicy;

  constructor(policy: EntityPolicy) {
    this.policy = policy;
  }

  async process(
    item: LocationProcessorResult,
    emit: LocationProcessorEmit,
  ): Promise<LocationProcessorResult | undefined> {
    if (item.type !== 'entity') {
      return item;
    }

    try {
      const output = await this.policy.enforce(item.entity);
      return result.entity(item.location, output);
    } catch (e) {
      emit(result.generalError(item.location, e.toString()));
      return undefined;
    }
  }
}
