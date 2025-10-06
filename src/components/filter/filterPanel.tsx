"use client";

import React from "react";
import { Modal, Button } from "antd";
import Filter from "./page"; // ✅ Import your FilterPanel

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FilterModal({ visible, onClose }: FilterModalProps) {
  return (
    <Modal
      title="Filter Products"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="apply" type="primary" onClick={onClose}>
          Apply Filters
        </Button>,
      ]}
    >
      {/* Render your FilterPanel inside the modal */}
      <Filter />
    </Modal>
  );
}
