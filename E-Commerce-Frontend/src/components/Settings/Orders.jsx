// src/components/Orders.jsx
import React, { useEffect } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './Orders.css';
import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBProgress,
  MDBProgressBar,
  MDBRow,
  MDBTypography,
  MDBSpinner,
} from 'mdb-react-ui-kit';

import { useCart } from '../../context/CartContext';
import { useOrderContext } from '../../context/OrderContext';

const Orders = () => {
  const { user } = useCart();
  const { orders, loading, error, fetchUserOrders } = useOrderContext();

  useEffect(() => {
    fetchUserOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <MDBSpinner grow />
      </div>
    );
  }

  if (error) {
    return (
      <MDBContainer className="py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </MDBContainer>
    );
  }

  return (
    <section
      className="orders-section py-5"
      style={{ backgroundColor: 'linear-gradient(to right, #7AA1ED, #A1C4FD)' }}
    >
      <MDBContainer>
        {orders?.length === 0 && (
          <div className="alert alert-info" role="alert">
            You have no orders yet.
          </div>
        )}

        {orders?.map(order => {
          const progress = order?.isDelivered
            ? 100
            : order?.isShipped
            ? 66
            : 33;

          return (
            <MDBCard
              key={order?._id}
              className="mb-5"
              style={{ borderRadius: '10px' }}
            >
              {/* Header */}
              <MDBCardHeader className="px-4 py-3">
                <MDBTypography tag="h6" className="mb-0 text-dark">
                  Order ID: <strong>{order?._id}</strong>
                  <span className="float-end text-dark">
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </span>
                </MDBTypography>
              </MDBCardHeader>

              {/* Body */}
              <MDBCardBody className="p-4">
                {/* Items */}
                {order?.orderItems.map(item => (
                  <MDBRow className="align-items-center mb-4" key={item._id}>
                    <MDBCol md="2">
                      <MDBCardImage
                        src={item.product.image}
                        fluid
                        alt={item.product.name}
                      />
                    </MDBCol>
                    <MDBCol md="3" className="text-dark">
                      {item.product.name}
                    </MDBCol>
                    <MDBCol md="2" className="text-dark">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </MDBCol>
                    <MDBCol md="5" className="text-dark">
                      Subtotal: ${(item.quantity * item.price).toFixed(2)}
                    </MDBCol>
                  </MDBRow>
                ))}

                <hr />

                {/* Progress Bar */}
                <MDBRow className="align-items-center">
                  <MDBCol md="2">
                    <p className="text-dark small mb-1">Track Order</p>
                  </MDBCol>
                  <MDBCol md="10">
                    <MDBProgress style={{ height: '6px', borderRadius: '16px' }}>
                      <MDBProgressBar
                        width={progress}
                        valuemin={0}
                        valuemax={100}
                        style={{
                          backgroundColor: '#A1C4FD',
                          borderRadius: '16px',
                        }}
                      />
                    </MDBProgress>
                    <div className="d-flex justify-content-between small mt-1 text-dark">
                      <span>Order Placed</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>

              {/* Clickable Footer */}
              <MDBCardFooter
                className="text-end py-3"
                style={{
                  backgroundColor: '#A1C4FD',
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px',
                }}
                onClick={() => console.log('Clicked order', order?._id)}
              >
                <MDBTypography
                  tag="h6"
                  className="text-white mb-0 text-uppercase"
                >
                  TOTAL PAID:&nbsp;
                  <span className="text-dark">
                    ${order?.totalPrice.toFixed(2)}
                  </span>
                </MDBTypography>
              </MDBCardFooter>
            </MDBCard>
          );
        })}
      </MDBContainer>
    </section>
  );
};

export default Orders;
