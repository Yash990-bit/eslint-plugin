/*
 * Copyright (c) Jupyter Development Team.
 * Distributed under the terms of the Modified BSD License.
 */

import * as path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';
import pluginDescription from '../src/rules/plugin-description';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    }
  }
});

const typeAwareTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      projectService: {
        allowDefaultProject: ['tests/*.ts'],
        defaultProject: 'tsconfig.json'
      },
      tsconfigRootDir: path.resolve(__dirname, '..')
    }
  }
});

ruleTester.run('plugin-description', pluginDescription, {
  valid: [
    {
      // A plain Lumino plugin is not a JupyterLab plugin.
      code: `
        const plugin: IPlugin<Application<Widget>, void> = {
          id: 'lumino-plugin',
          activate: (app: Application<Widget>) => {}
        };
      `
    },
    {
      code: `
        const plugin: JupyterFrontEndPlugin<void> = {
          'id': 'jupyterlab-notify:plugin',
          'description': 'Enhanced cell execution notifications for JupyterLab',
          autoStart: true,
          activate: (app: JupyterFrontEnd) => {
            console.log('Activated');
          }
        };
      `
    },
    {
      code: `
        const description = 'My plugin description';
        const test: JupyterFrontEndPlugin<void> = {
          id: 'var-desc-plugin',
          description: description,
          activate: (app: JupyterFrontEnd) => {}
        };
      `
    },
    {
      code: `
        const plugins: JupyterFrontEndPlugin<any>[] = [
          {
            id: 'plugin-1',
            description: 'First plugin',
            autoStart: true,
            activate: () => {}
          },
          {
            id: 'plugin-2',
            description: 'Second plugin',
            autoStart: true,
            activate: () => {}
          }
        ];
      `
    },
    {
      code: `
        const plugins: Array<JupyterFrontEndPlugin<unknown>> = [
          {
            id: 'plugin-1',
            description: 'First plugin',
            activate: () => {}
          }
        ];
      `
    },
    {
      code: `
        const plugins = [
          {
            id: 'plugin-1',
            description: 'First plugin',
            activate: () => {}
          }
        ] as JupyterFrontEndPlugin<any>[];
      `
    },
    {
      code: `
        export default [
          {
            id: 'plugin-1',
            description: 'First plugin',
            activate: () => {}
          }
        ] as JupyterFrontEndPlugin<any>[];
      `
    },
    {
      // Referencing an identifier in array does not duplicate errors
      code: `
        const plugin1: JupyterFrontEndPlugin<void> = {
          id: 'plugin-1',
          description: 'First plugin',
          activate: () => {}
        };
        const plugins: JupyterFrontEndPlugin<any>[] = [plugin1];
      `
    },
    {
      // Non-plugin array should be ignored
      code: `
        const commands = [
          { id: 'cmd-1', label: 'Command 1' }
        ];
      `
    },
    {
      // Generic wrapper like Record<string, JupyterFrontEndPlugin<any>> should not be treated as a plugin container
      code: `
        const registry: Record<string, JupyterFrontEndPlugin<any>> = {
          first: {
            id: 'first',
            description: 'ok'
          }
        };
      `
    },
    {
      // Map/Set should not be treated as plugin containers
      code: `
        const pluginMap: Map<string, JupyterFrontEndPlugin<any>> = new Map();
      `
    },
    {
      // Tuple with rest element
      code: `
        const plugins: [JupyterFrontEndPlugin<any>, ...JupyterFrontEndPlugin<any>[]] = [
          {
            id: 'plugin-1',
            description: 'First plugin',
            activate: () => {}
          },
          {
            id: 'plugin-2',
            description: 'Second plugin',
            activate: () => {}
          }
        ];
      `
    },
    {
      code: `
        const plugin: app.JupyterFrontEndPlugin<void> = {
          id: 'test-plugin',
          description: 'A namespaced plugin',
          activate: () => {}
        };
      `
    },
    {
      code: `
        const plugin: Partial<JupyterFrontEndPlugin<void>> = {
          id: 'test-plugin',
          description: 'A partial plugin',
          activate: () => {}
        };
      `
    },
    {
      // Readonly array and tuple type operators
      code: `
        const plugins: readonly JupyterFrontEndPlugin<any>[] = [
          {
            id: 'readonly-plugin',
            description: 'Readonly plugin',
            activate: () => {}
          }
        ];
        const tuplePlugins: readonly [JupyterFrontEndPlugin<any>] = [
          {
            id: 'readonly-tuple-plugin',
            description: 'Readonly tuple plugin',
            activate: () => {}
          }
        ];
        const optionalTuple: [JupyterFrontEndPlugin<any>?] = [
          {
            id: 'optional-tuple-plugin',
            description: 'Optional tuple plugin',
            activate: () => {}
          }
        ];
      `
    },
    {
      code: `
        function make(): JupyterFrontEndPlugin<void> {
          return {
            id: 'factory-plugin',
            description: 'Factory plugin description',
            activate: () => {}
          };
        }
      `
    },
    {
      code: `
        function make(): JupyterFrontEndPlugin<void>[] {
          return [
            {
              id: 'factory-array-plugin',
              description: 'Factory array plugin description',
              activate: () => {}
            }
          ];
        }
      `
    },
    {
      // Arbitrary generic wrappers and Omit are not treated as plugin containers
      code: `
        const w: Wrapper<JupyterFrontEndPlugin<any>> = {
          id: 'wrapper-plugin',
          activate: () => {}
        };
      `
    },
    {
      code: `
        const o: Omit<JupyterFrontEndPlugin<any>, 'description'> = {
          id: 'omit-plugin',
          activate: () => {}
        };
      `
    },
    {
      code: `
        const plugin: Required<JupyterFrontEndPlugin<void>> = {
          id: 'required-plugin',
          description: 'Required plugin description',
          activate: () => {}
        };
      `
    },
    {
      code: `
        const plugin: Private.JupyterFrontEndPlugin<void> = {
          id: 'private-namespaced-plugin',
          description: 'Private plugin description',
          activate: () => {}
        };
      `
    },
    {
      // Non-empty template literal description
      code: `
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'template-desc-plugin',
          description: \`Enhanced notifications for JupyterLab\`,
          activate: () => {}
        };
      `
    },
    {
      // Template literal with constant expression
      code: `
        const FEATURE = 'notifications';
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'template-expr-plugin',
          description: \`Enhanced \${FEATURE} for JupyterLab\`,
          activate: () => {}
        };
      `
    },
    {
      // Non-empty constant description
      code: `
        const PLUGIN_DESC = 'Provides commands for notebooks.';
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'const-desc-plugin',
          description: PLUGIN_DESC,
          activate: () => {}
        };
      `
    },
    {
      // Dynamic description function call is allowed
      code: `
        function getPluginDescription(): string {
          return 'Dynamic description';
        }
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'dynamic-desc-plugin',
          description: getPluginDescription(),
          activate: () => {}
        };
      `
    },
    {
      // Shadowed undefined parameter as dynamic description is allowed
      code: `
        function makePlugin(undefined: string): JupyterFrontEndPlugin<void> {
          return {
            id: 'shadowed-undefined-plugin',
            description: undefined,
            activate: () => {}
          };
        }
      `
    }
  ],

  invalid: [
    {
      code: `
        const plugin: Partial<JupyterFrontEndPlugin<void>> = {
          id: 'partial-plugin',
          activate: () => {}
        };
      `,
      errors: [{ messageId: 'missingDescription' }]
    },
    {
      code: `
        async function createPlugin(): Promise<JupyterFrontEndPlugin<void>> {
          return {
            id: 'async-plugin',
            activate: () => {}
          };
        }
      `,
      errors: [{ messageId: 'missingDescription' }]
    },
    {
      code: `
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'jupyterlab-notify:plugin',
          autoStart: true,
          activate: (app: JupyterFrontEnd) => {
            console.log('Activated');
          }
        };
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "jupyterlab-notify:plugin"' }
        }
      ]
    },
    {
      code: `
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'empty-desc-plugin',
          description: '',
          activate: (app: JupyterFrontEnd) => {}
        };
      `,
      errors: [
        {
          messageId: 'emptyDescription',
          data: { pluginId: ' "empty-desc-plugin"' }
        }
      ]
    },
    {
      code: `
        const plugins: JupyterFrontEndPlugin<any>[] = [
          {
            id: 'plugin-missing-desc',
            autoStart: true,
            activate: () => {}
          }
        ];
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "plugin-missing-desc"' }
        }
      ]
    },
    {
      code: `
        const plugins: JupyterFrontEndPlugin<any>[] = [
          {
            id: 'plugin-1',
            autoStart: true,
            activate: () => {}
          },
          {
            id: 'plugin-2',
            description: '   ',
            autoStart: true,
            activate: () => {}
          }
        ];
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "plugin-1"' }
        },
        {
          messageId: 'emptyDescription',
          data: { pluginId: ' "plugin-2"' }
        }
      ]
    },
    {
      code: `
        const plugins: Array<JupyterFrontEndPlugin<unknown>> = [
          {
            id: 'array-plugin',
            activate: () => {}
          }
        ];
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "array-plugin"' }
        }
      ]
    },
    {
      code: `
        const plugins = [
          {
            id: 'cast-plugin',
            activate: () => {}
          }
        ] as JupyterFrontEndPlugin<any>[];
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "cast-plugin"' }
        }
      ]
    },
    {
      code: `
        export default [
          {
            id: 'default-export-plugin',
            activate: () => {}
          }
        ] as JupyterFrontEndPlugin<any>[];
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "default-export-plugin"' }
        }
      ]
    },
    {
      code: `
        const plugin = {
          id: 'single-cast-plugin',
          activate: () => {}
        } as JupyterFrontEndPlugin<void>;
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "single-cast-plugin"' }
        }
      ]
    },
    {
      code: `
        const plugins: [JupyterFrontEndPlugin<any>, ...JupyterFrontEndPlugin<any>[]] = [
          {
            id: 'tuple-plugin',
            activate: () => {}
          }
        ];
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "tuple-plugin"' }
        }
      ]
    },
    {
      code: `
        const plugins: readonly JupyterFrontEndPlugin<any>[] = [
          {
            id: 'readonly-plugin-missing-desc',
            activate: () => {}
          }
        ];
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "readonly-plugin-missing-desc"' }
        }
      ]
    },
    {
      code: `
        function make(): JupyterFrontEndPlugin<void> {
          return {
            id: 'factory-plugin',
            activate: () => {}
          };
        }
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "factory-plugin"' }
        }
      ]
    },
    {
      code: `
        function make(): JupyterFrontEndPlugin<void>[] {
          return [
            {
              id: 'factory-array-plugin',
              activate: () => {}
            }
          ];
        }
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "factory-array-plugin"' }
        }
      ]
    },
    {
      code: `
        const plugin: app.JupyterFrontEndPlugin<void> = {
          id: 'namespaced-plugin',
          activate: () => {}
        };
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "namespaced-plugin"' }
        }
      ]
    },
    {
      code: `
        const plugin: Required<JupyterFrontEndPlugin<void>> = {
          id: 'required-plugin',
          activate: () => {}
        };
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "required-plugin"' }
        }
      ]
    },
    {
      code: `
        const plugin: Private.JupyterFrontEndPlugin<void> = {
          id: 'private-plugin',
          activate: () => {}
        };
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "private-plugin"' }
        }
      ]
    },
    {
      // Mixed union array with missing description
      code: `
        const plugins: (JupyterFrontEndPlugin<any> | ServiceManagerPlugin<any>)[] = [
          {
            id: 'mixed-plugin',
            activate: () => {}
          }
        ];
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "mixed-plugin"' }
        }
      ]
    },
    {
      // Tuple with rest element past fixed length
      code: `
        const plugins: [JupyterFrontEndPlugin<any>, ...ServiceManagerPlugin<any>[]] = [
          {
            id: 'fe-plugin',
            description: 'Frontend description',
            activate: () => {}
          },
          {
            id: 'sm-plugin-1',
            activate: () => {}
          },
          {
            id: 'sm-plugin-2',
            activate: () => {}
          }
        ];
      `,
      errors: [
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "sm-plugin-1"' }
        },
        {
          messageId: 'missingDescription',
          data: { pluginId: ' "sm-plugin-2"' }
        }
      ]
    },
    {
      // Empty template literal description
      code: `
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'empty-template-plugin',
          description: \`\`,
          activate: () => {}
        };
      `,
      errors: [
        {
          messageId: 'emptyDescription',
          data: { pluginId: ' "empty-template-plugin"' }
        }
      ]
    },
    {
      // Whitespace-only template literal description
      code: `
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'whitespace-template-plugin',
          description: \`   \`,
          activate: () => {}
        };
      `,
      errors: [
        {
          messageId: 'emptyDescription',
          data: { pluginId: ' "whitespace-template-plugin"' }
        }
      ]
    },
    {
      // Empty constant description
      code: `
        const EMPTY_DESC = '';
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'empty-const-plugin',
          description: EMPTY_DESC,
          activate: () => {}
        };
      `,
      errors: [
        {
          messageId: 'emptyDescription',
          data: { pluginId: ' "empty-const-plugin"' }
        }
      ]
    },
    {
      // Whitespace-only constant description
      code: `
        const WS_DESC = '   ';
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'ws-const-plugin',
          description: WS_DESC,
          activate: () => {}
        };
      `,
      errors: [
        {
          messageId: 'emptyDescription',
          data: { pluginId: ' "ws-const-plugin"' }
        }
      ]
    },
    {
      // Template literal with empty constant
      code: `
        const EMPTY = '';
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'template-empty-const-plugin',
          description: \`\${EMPTY}\`,
          activate: () => {}
        };
      `,
      errors: [
        {
          messageId: 'emptyDescription',
          data: { pluginId: ' "template-empty-const-plugin"' }
        }
      ]
    },
    {
      // Identifier undefined as description
      code: `
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'undefined-desc-plugin',
          description: undefined,
          activate: () => {}
        };
      `,
      errors: [
        {
          messageId: 'emptyDescription',
          data: { pluginId: ' "undefined-desc-plugin"' }
        }
      ]
    }
  ]
});

typeAwareTester.run('plugin-description (type-aware)', pluginDescription, {
  valid: [
    {
      filename: 'tests/type-aware-fixture.ts',
      code: `
        declare const validDesc: 'Provides commands for notebooks.';
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'type-aware-valid-plugin',
          description: validDesc,
          activate: () => {}
        };
      `
    }
  ],
  invalid: [
    {
      filename: 'tests/type-aware-fixture.ts',
      code: `
        declare const emptyDesc: '';
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'type-aware-empty-plugin',
          description: emptyDesc,
          activate: () => {}
        };
      `,
      errors: [
        {
          messageId: 'emptyDescription',
          data: { pluginId: ' "type-aware-empty-plugin"' }
        }
      ]
    },
    {
      filename: 'tests/type-aware-fixture.ts',
      code: `
        declare const wsDesc: '   ';
        const plugin: JupyterFrontEndPlugin<void> = {
          id: 'type-aware-ws-plugin',
          description: wsDesc,
          activate: () => {}
        };
      `,
      errors: [
        {
          messageId: 'emptyDescription',
          data: { pluginId: ' "type-aware-ws-plugin"' }
        }
      ]
    }
  ]
});
