import React from 'react';
import {
  SectionList,
  StyleSheet,
  RefreshControl,
  SectionListData,
} from 'react-native';

interface ListProps<ItemT, SectionT> {
  sections: ReadonlyArray<SectionListData<ItemT, SectionT>>;
  renderItem: ({item}: {item: ItemT}) => React.ReactElement | null;
  renderSectionHeader: (info: {
    section: SectionListData<ItemT, SectionT>;
  }) => React.ReactElement | null;
  refreshing: boolean;
  onRefresh: () => void;
  keyExtractor: (item: ItemT, index: number) => string;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const ITEM_HEIGHT = 64;
const SECTION_HEADER_HEIGHT = 34;

const List = <ItemT, SectionT>({
  sections,
  renderItem,
  renderSectionHeader,
  refreshing,
  onRefresh,
  keyExtractor,
  ListFooterComponent,
  ListEmptyComponent,
}: ListProps<ItemT, SectionT>) => {
  const getItemLayout = React.useCallback(
    (
      data: SectionListData<ItemT, SectionT>[] | null,
      index: number,
    ): {length: number; offset: number; index: number} => {
      if (!data) {
        return {length: 0, offset: 0, index};
      }

      let offset = 0;
      let absoluteIndex = 0;

      for (const section of data) {
        if (index === absoluteIndex) {
          return {length: SECTION_HEADER_HEIGHT, offset, index};
        }
        offset += SECTION_HEADER_HEIGHT;
        absoluteIndex += 1;

        if (index < absoluteIndex + section.data.length) {
          const itemIndexInSection = index - absoluteIndex;
          return {
            length: ITEM_HEIGHT,
            offset: offset + itemIndexInSection * ITEM_HEIGHT,
            index,
          };
        }

        offset += section.data.length * ITEM_HEIGHT;
        absoluteIndex += section.data.length;
      }

      return {length: 0, offset, index};
    },
    [],
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      contentContainerStyle={
        sections.length > 0 ? styles.listContent : styles.emptyContent
      }
      stickySectionHeadersEnabled={false}
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      windowSize={5}
      getItemLayout={getItemLayout}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  emptyContent: {
    flex: 1,
  },
});

export default React.memo(List) as typeof List;
