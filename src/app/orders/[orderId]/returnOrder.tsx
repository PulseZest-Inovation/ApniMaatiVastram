import React, { useState } from 'react';
import { Modal, Select, Upload, Button, message, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/config/FirebaseConfig';
import { ApplicationConfig } from '@/config/ApplicationConfig';
import { setDocWithCustomId } from '@/service/Firebase/postFirestore';

interface OrderReturnModelProps {
  open: boolean;
  onClose: () => void;
  userUid: string;
  orderId: string;
}

export default function OrderReturnModal({ open, onClose, userUid, orderId }: OrderReturnModelProps) {
  const [returnReason, setReturnReason] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Function to upload file to Firebase Storage
  const uploadToFirebase = async (file: File) => {
    if (!file) {
      message.error("No file selected.");
      return;
    }

    if (!returnReason) {
      message.error("Please select a return reason.");
      return;
    }

    setUploading(true);
    setProgress(0);
    
    const storageRef = ref(storage, `${ApplicationConfig}/returns/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadProgress);
      },
      (error) => {
        console.error('Upload failed:', error);
        message.error('Upload failed. Please try again.');
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at:', downloadURL);

        // Update Firestore with return request details
        await Promise.all([
          setDocWithCustomId('orders', orderId, {
            status: 'RequestReturned',
            productReturnVideo: downloadURL,
            returnReason,
          }),
          setDocWithCustomId(`customers/${userUid}/orders/`, orderId, {
            status: 'RequestReturned',
            productReturnVideo: downloadURL,
            returnReason,
          }),
        ]);

        message.success('Return request submitted successfully!');
        setUploading(false);
        setProgress(100);

        // Close modal after a slight delay for better UX
        setTimeout(onClose, 500);
      }
    );
  };

  return (
    <Modal
      open={open}
      onOk={() => {
        if (uploadFile) {
          uploadToFirebase(uploadFile);
        } else {
          message.warning("Please select a file before submitting.");
        }
      }}
      okText= 'Return'
      onCancel={onClose}
      title="Return Order"
      confirmLoading={uploading}
      okButtonProps={{ disabled: uploading }} 
    >
      <h3>Select Return Reason:</h3>
      <Select
        style={{ width: '100%', marginBottom: '16px' }}
        onChange={(value) => setReturnReason(value)}
        placeholder="Select a reason"
        disabled={uploading}
      >
        <Select.Option value="Damaged Product">Damaged Product</Select.Option>
        <Select.Option value="Wrong Item Delivered">Wrong Item Delivered</Select.Option>
        <Select.Option value="Others">Others</Select.Option>
      </Select>

      <h3>Upload Unboxing Video:</h3>
      <Upload
        accept="video/*"
        beforeUpload={(file) => {
          setUploadFile(file);
          return false; // Prevents auto-upload
        }}
        showUploadList={false} // Hide default Ant Design file list
        disabled={uploading}
      >
        <Button icon={<UploadOutlined />} disabled={uploading}>
          {uploading ? "Uploading..." : "Click to Upload"}
        </Button>
      </Upload>

      {uploading && <Progress percent={Math.round(progress)} />}
    </Modal>
  );
}
