"use client";

import React, { useRef } from "react";
import { Modal, Button } from "antd";
import FilterPanel, { FilterPanelRef } from "./page";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    categories: string[];
    stockStatus: string[];
    priceRange: [number, number][];
  }) => void;
}

export default function FilterModal({visible,onClose,onApplyFilters,}: FilterModalProps) {
  const filterRef = useRef<FilterPanelRef>(null);

  const handleApply = () => {
    const filters = filterRef.current?.getSelectedFilters();
    if (filters) {
      onApplyFilters(filters);
    }
    onClose();
  };

  return (
    <Modal
      title="Filter Products"
      open={visible}
      onCancel={onClose}
      width={400} 
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Apply Filters
        </Button>,
      ]}
    >
      <FilterPanel ref={filterRef} />
    </Modal>
  );
}
