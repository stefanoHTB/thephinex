import {Button, Popover, ActionList} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import {LegacyCard, ResourceList, ResourceItem, Text, Card} from '@shopify/polaris';
import type {ResourceListProps} from '@shopify/polaris';


const items = [
  {
    id: '6',
    title: 'Products',
  },
  {
    id: '7',
    title: 'Customers',
  },
];


export function ActionListInPopoverExample() {
  const [active, setActive] = useState(true);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const handleImportedAction = useCallback(
    () => console.log('Imported action'),
    [],
  );

  const handleExportedAction = useCallback(
    () => console.log('Exported action'),
    [],
  );

  const activator = (
    <Button onClick={toggleActive} disclosure>
      Select Sheets
    </Button>
  );

  const [selectedItems, setSelectedItems] =
  useState<ResourceListProps['selectedItems']>([]);

  return (
    <div style={{height: '250px'}}>
      <Popover
        active={active}
        activator={activator}
        autofocusTarget="first-node"
        onClose={toggleActive}
      >

       <LegacyCard>
      <ResourceList
        resourceName={{singular: 'Entity', plural: 'Entities'}}
        items={items}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        selectable
        renderItem={(item) => { 
          const {id , title} = item;
          return (
            <ResourceItem
              id={id}
              onClick={(id)=>{
                //login to open card dynamically
                console.log(id, 'id')
              }}
              accessibilityLabel={`View details for ${title}`}
              name={title}
            >
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                {title}
              </Text>
            </ResourceItem>
          );
        }}
      />
    </LegacyCard>
      </Popover>
    </div>
  );
}