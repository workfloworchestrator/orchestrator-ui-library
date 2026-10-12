import { StartComboBoxOption, StartWorkflowGroups } from '@/types';

import {
  StartWorkflowOptionSource,
  filterGroupedStartOptions,
  getStartWorkflowComboBoxOptions,
  hasStartWorkflowGroups,
} from './utils';

const option = (productName: string, productDescription = '', isAllowed = true): StartWorkflowOptionSource => ({
  workflowName: `create_${productName.replace(/ /g, '_')}`,
  productId: `id-${productName}`,
  productName,
  productDescription,
  isAllowed,
});

const options: StartWorkflowOptionSource[] = [
  option('node Cisco', 'Cisco router'),
  option('core link', 'Backbone link'),
  option('l2 path'),
  option('ip service', 'IP transit', false),
];

const labels = (comboBoxOptions: StartComboBoxOption[]) =>
  comboBoxOptions.map(({ label, isGroupLabel }) => (isGroupLabel ? `# ${label}` : label));

describe('WfoStartButton utils', () => {
  describe('getStartWorkflowComboBoxOptions()', () => {
    describe('without groups', () => {
      it('returns a flat list of product names sorted by label', () => {
        const result = getStartWorkflowComboBoxOptions(options, undefined, undefined, 'Other');

        expect(result).toEqual([
          {
            data: { workflowName: 'create_core_link', productId: 'id-core link' },
            label: 'core link',
            disabled: false,
          },
          {
            data: { workflowName: 'create_ip_service', productId: 'id-ip service' },
            label: 'ip service',
            disabled: true,
          },
          { data: { workflowName: 'create_l2_path', productId: 'id-l2 path' }, label: 'l2 path', disabled: false },
          {
            data: { workflowName: 'create_node_Cisco', productId: 'id-node Cisco' },
            label: 'node Cisco',
            disabled: false,
          },
        ]);
      });

      it('treats groups without any list of product names as no groups', () => {
        const groups = { BB: 'node Cisco' } as unknown as StartWorkflowGroups;

        expect(labels(getStartWorkflowComboBoxOptions(options, 'name', groups, 'Other'))).toEqual([
          'core link',
          'ip service',
          'l2 path',
          'node Cisco',
        ]);
        expect(labels(getStartWorkflowComboBoxOptions(options, 'name', {}, 'Other'))).toHaveLength(4);
      });
    });

    describe('with description labels', () => {
      it('shows descriptions sorted by description, falling back to the name when empty', () => {
        const result = getStartWorkflowComboBoxOptions(options, 'description', undefined, 'Other');

        expect(labels(result)).toEqual(['Backbone link', 'Cisco router', 'IP transit', 'l2 path']);
      });

      it('keeps the product name searchable', () => {
        const result = getStartWorkflowComboBoxOptions(options, 'description', undefined, 'Other');

        expect(result.find(({ label }) => label === 'Cisco router')?.searchableLabel).toBe('Cisco router node Cisco');
        expect(result.find(({ label }) => label === 'l2 path')?.searchableLabel).toBeUndefined();
      });

      it('falls back to the name for a blank description', () => {
        const result = getStartWorkflowComboBoxOptions([option('l2 path', '   ')], 'description', undefined, 'Other');

        expect(labels(result)).toEqual(['l2 path']);
      });
    });

    describe('with groups', () => {
      it('shows groups in key order with sorted products and the remaining products last', () => {
        const groups = { 'CESNET BB': ['node Cisco', 'core link'], OOB: ['l2 path'] };

        expect(labels(getStartWorkflowComboBoxOptions(options, 'name', groups, 'Other'))).toEqual([
          '# CESNET BB',
          'core link',
          'node Cisco',
          '# OOB',
          'l2 path',
          '# Other',
          'ip service',
        ]);
      });

      it('leaves out empty groups and ignores unknown product names', () => {
        const groups = {
          'CESNET BB': ['node Cisco', 'core link', 'l2 path', 'ip service'],
          'CESNET DWDM': ['node ROADM'],
        };

        expect(labels(getStartWorkflowComboBoxOptions(options, 'name', groups, 'Other'))).toEqual([
          '# CESNET BB',
          'core link',
          'ip service',
          'l2 path',
          'node Cisco',
        ]);
      });

      it('shows a product listed in several groups in each of them', () => {
        const groups = { BB: ['core link'], DCI: ['core link'] };

        expect(labels(getStartWorkflowComboBoxOptions(options, 'name', groups, 'Other'))).toEqual([
          '# BB',
          'core link',
          '# DCI',
          'core link',
          '# Other',
          'ip service',
          'l2 path',
          'node Cisco',
        ]);
      });

      it('skips groups without a list of product names', () => {
        const groups = { BB: ['core link'], Broken: 'l2 path' } as unknown as StartWorkflowGroups;

        expect(labels(getStartWorkflowComboBoxOptions(options, 'name', groups, 'Other'))).toEqual([
          '# BB',
          'core link',
          '# Other',
          'ip service',
          'l2 path',
          'node Cisco',
        ]);
      });

      it('matches groups by product name when showing descriptions', () => {
        const groups = { BB: ['node Cisco'] };

        expect(labels(getStartWorkflowComboBoxOptions(options, 'description', groups, 'Other'))).toEqual([
          '# BB',
          'Cisco router',
          '# Other',
          'Backbone link',
          'IP transit',
          'l2 path',
        ]);
      });

      it('keeps disabled products in their group', () => {
        const result = getStartWorkflowComboBoxOptions(options, 'name', { BB: ['ip service'] }, 'Other');

        expect(result[1]).toMatchObject({ label: 'ip service', disabled: true });
      });
    });
  });

  describe('hasStartWorkflowGroups()', () => {
    it('is true only when at least one group has a list of product names', () => {
      expect(hasStartWorkflowGroups(undefined)).toBe(false);
      expect(hasStartWorkflowGroups({})).toBe(false);
      expect(hasStartWorkflowGroups({ BB: 'x' } as unknown as StartWorkflowGroups)).toBe(false);
      expect(hasStartWorkflowGroups({ BB: [] })).toBe(true);
    });
  });

  describe('filterGroupedStartOptions()', () => {
    const groups = { 'CESNET BB': ['node Cisco', 'core link'], OOB: ['l2 path'] };
    const grouped = getStartWorkflowComboBoxOptions(options, 'name', groups, 'Other');

    it('returns all options for an empty search value', () => {
      expect(filterGroupedStartOptions(grouped, '  ')).toBe(grouped);
    });

    it('keeps matching products under their group heading', () => {
      expect(labels(filterGroupedStartOptions(grouped, 'node'))).toEqual(['# CESNET BB', 'node Cisco']);
    });

    it('keeps all products of a group matching the search value', () => {
      expect(labels(filterGroupedStartOptions(grouped, 'bb'))).toEqual(['# CESNET BB', 'core link', 'node Cisco']);
    });

    it('matches case-insensitively across groups', () => {
      expect(labels(filterGroupedStartOptions(grouped, 'P'))).toEqual(['# OOB', 'l2 path', '# Other', 'ip service']);
    });

    it('returns nothing when no product or group matches', () => {
      expect(filterGroupedStartOptions(grouped, 'roadm')).toEqual([]);
    });

    it('matches the product name of options labelled by description', () => {
      const described = getStartWorkflowComboBoxOptions(options, 'description', groups, 'Other');

      expect(labels(filterGroupedStartOptions(described, 'cisco'))).toEqual(['# CESNET BB', 'Cisco router']);
      expect(labels(filterGroupedStartOptions(described, 'node c'))).toEqual(['# CESNET BB', 'Cisco router']);
    });
  });
});
