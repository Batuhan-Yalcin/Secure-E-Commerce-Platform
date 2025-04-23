import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaShoppingCart, FaArrowLeft, FaSpinner, FaExclamationCircle, FaTimes, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import orderService from '../../services/orderService';
import { OrderResponse, OrderStatus, OrderStatusUpdateRequest } from '../../types';

// Stil bileşenleri
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHead = styled.thead`
  background-color: #f8fafc;
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }
  
  &:hover {
    background-color: #f8fafc;
  }
`;

const TableHeader = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  font-size: 0.875rem;
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  color: #1e293b;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span<{ $status: OrderStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  gap: 0.25rem;
  
  ${({ $status }) => {
    switch ($status) {
      case OrderStatus.PENDING:
        return `
          background-color: #fef3c7;
          color: #d97706;
        `;
      case OrderStatus.PROCESSING:
        return `
          background-color: #dbeafe;
          color: #2563eb;
        `;
      case OrderStatus.SHIPPED:
        return `
          background-color: #e0f2fe;
          color: #0284c7;
        `;
      case OrderStatus.DELIVERED:
        return `
          background-color: #dcfce7;
          color: #16a34a;
        `;
      case OrderStatus.CANCELLED:
        return `
          background-color: #fee2e2;
          color: #dc2626;
        `;
      default:
        return `
          background-color: #e5e7eb;
          color: #4b5563;
        `;
    }
  }}
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  font-size: 1.25rem;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  padding: 1.5rem;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const StatusButton = styled.button<{ $variant: 'primary' | 'success' | 'danger' | 'warning' | 'info' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: #3b82f6;
          border: 1px solid #3b82f6;
          color: white;
          
          &:hover {
            background-color: #2563eb;
            border-color: #2563eb;
          }
        `;
      case 'success':
        return `
          background-color: #10b981;
          border: 1px solid #10b981;
          color: white;
          
          &:hover {
            background-color: #059669;
            border-color: #059669;
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          border: 1px solid #ef4444;
          color: white;
          
          &:hover {
            background-color: #dc2626;
            border-color: #dc2626;
          }
        `;
      case 'warning':
        return `
          background-color: #f59e0b;
          border: 1px solid #f59e0b;
          color: white;
          
          &:hover {
            background-color: #d97706;
            border-color: #d97706;
          }
        `;
      case 'info':
        return `
          background-color: #0ea5e9;
          border: 1px solid #0ea5e9;
          color: white;
          
          &:hover {
            background-color: #0284c7;
            border-color: #0284c7;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      opacity: 0.6;
    }
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  padding: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #334155;
  }
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

const ConfirmMessage = styled.p`
  color: #4b5563;
  margin: 0;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'danger' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: #3b82f6;
          border: 1px solid #3b82f6;
          color: white;
          
          &:hover {
            background-color: #2563eb;
            border-color: #2563eb;
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          border: 1px solid #ef4444;
          color: white;
          
          &:hover {
            background-color: #dc2626;
            border-color: #dc2626;
          }
        `;
      default:
        return `
          background-color: white;
          border: 1px solid #e2e8f0;
          color: #4b5563;
          
          &:hover {
            border-color: #d1d5db;
            color: #1e293b;
          }
        `;
    }
  }}
`;

interface OrderDetailProps {}

const OrderDetail: React.FC<OrderDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state'leri
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const orderData = await orderService.getOrderById(parseInt(id));
        setOrder(orderData);
        setError(null);
      } catch (err: any) {
        console.error('Sipariş detayları alınırken hata:', err);
        setError(err.response?.data?.message || 'Sipariş detayları alınamadı');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);
  
  const handleStatusUpdate = (status: OrderStatus) => {
    setSelectedStatus(status);
    setIsModalOpen(true);
  };
  
  const confirmStatusUpdate = async () => {
    if (!selectedStatus || !order) return;
    
    try {
      setLoading(true);
      
      const statusData: OrderStatusUpdateRequest = {
        status: selectedStatus
      };
      
      const updatedOrder = await orderService.updateOrderStatus(order.id, statusData);
      setOrder(updatedOrder);
      
      setIsModalOpen(false);
      setSelectedStatus(null);
      
      toast.success(`Sipariş durumu "${selectedStatus}" olarak güncellendi`);
    } catch (err: any) {
      console.error('Sipariş durumu güncellenirken hata:', err);
      toast.error(err.response?.data?.message || 'Sipariş durumu güncellenemedi');
    } finally {
      setLoading(false);
    }
  };
  
  // Para birimi formatı
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    });
  };
  
  // Tarih formatı
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Yükleme durumu
  if (loading && !order) {
    return (
      <LoadingContainer>
        <FaSpinner /> Yükleniyor...
      </LoadingContainer>
    );
  }
  
  // Hata durumu
  if (error) {
    return (
      <ErrorContainer>
        <FaExclamationCircle /> {error}
      </ErrorContainer>
    );
  }
  
  // Sipariş bulunamadı
  if (!order) {
    return (
      <ErrorContainer>
        <FaExclamationCircle /> Sipariş bulunamadı
      </ErrorContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <div>
          <BackButton onClick={() => navigate('/admin/orders')}>
            <FaArrowLeft /> Siparişlere Dön
          </BackButton>
          <Title>
            <FaShoppingCart /> Sipariş #{order.id}
          </Title>
        </div>
        <StatusBadge $status={order.status as OrderStatus}>
          {order.status}
        </StatusBadge>
      </PageHeader>
      
      <Card>
        <SectionTitle>Sipariş Bilgileri</SectionTitle>
        <Grid>
          <DetailItem>
            <DetailLabel>Sipariş Numarası</DetailLabel>
            <DetailValue>#{order.id}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Kullanıcı ID</DetailLabel>
            <DetailValue>#{order.userId}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Sipariş Tarihi</DetailLabel>
            <DetailValue>{formatDate(order.orderDate)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Toplam Tutar</DetailLabel>
            <DetailValue>{formatCurrency(order.totalAmount)}</DetailValue>
          </DetailItem>
        </Grid>
      </Card>
      
      <Card>
        <SectionTitle>Sipariş Öğeleri</SectionTitle>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Ürün ID</TableHeader>
              <TableHeader>Miktar</TableHeader>
            </TableRow>
          </TableHead>
          <tbody>
            {order.orderItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>#{item.productId}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>
      
      <Card>
        <SectionTitle>Sipariş Durumunu Güncelle</SectionTitle>
        <StatusButtonsContainer>
          <StatusButton
            $variant="warning"
            onClick={() => handleStatusUpdate(OrderStatus.PENDING)}
            disabled={order.status === OrderStatus.PENDING}
          >
            {OrderStatus.PENDING}
          </StatusButton>
          <StatusButton
            $variant="info"
            onClick={() => handleStatusUpdate(OrderStatus.PROCESSING)}
            disabled={order.status === OrderStatus.PROCESSING}
          >
            {OrderStatus.PROCESSING}
          </StatusButton>
          <StatusButton
            $variant="primary"
            onClick={() => handleStatusUpdate(OrderStatus.SHIPPED)}
            disabled={order.status === OrderStatus.SHIPPED}
          >
            {OrderStatus.SHIPPED}
          </StatusButton>
          <StatusButton
            $variant="success"
            onClick={() => handleStatusUpdate(OrderStatus.DELIVERED)}
            disabled={order.status === OrderStatus.DELIVERED}
          >
            {OrderStatus.DELIVERED}
          </StatusButton>
          <StatusButton
            $variant="danger"
            onClick={() => handleStatusUpdate(OrderStatus.CANCELLED)}
            disabled={order.status === OrderStatus.CANCELLED}
          >
            {OrderStatus.CANCELLED}
          </StatusButton>
        </StatusButtonsContainer>
      </Card>
      
      {/* Durum Güncelleme Onay Modal */}
      {isModalOpen && selectedStatus && (
        <ModalBackdrop onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Sipariş Durumunu Güncelle</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <ConfirmMessage>
                Sipariş durumunu <strong>{selectedStatus}</strong> olarak güncellemek istediğinize emin misiniz?
              </ConfirmMessage>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setIsModalOpen(false)}>
                İptal
              </Button>
              <Button $variant="primary" onClick={confirmStatusUpdate}>
                <FaCheck /> Onayla
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalBackdrop>
      )}
    </PageContainer>
  );
};

export default OrderDetail; 