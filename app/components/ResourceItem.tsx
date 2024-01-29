import {LegacyCard, ResourceList, ResourceItem, Text, Card} from '@shopify/polaris';
import type {ResourceListProps} from '@shopify/polaris';
import {useState} from 'react';

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

export function ResourceItemExample() {
  const [selectedItems, setSelectedItems] =
   useState<ResourceListProps['selectedItems']>([]);

  return (
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
  );
}