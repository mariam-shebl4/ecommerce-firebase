import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Box, Divider, Typography } from "@mui/material";
import Loading from "../components/Loading";

type Order = {
  id: string;
  totalAmount: number;
  items: { name: string; quantity: number; price: number; image: string }[];
  timestamp: { toDate: () => Date };

};

export default function History() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async (userId: string) => {
      try {
        const q = query(collection(db, "orders"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
  
        // Sort orders by timestamp (newest first)
        fetchedOrders.sort((a, b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime());
  
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        fetchOrders(user.uid);
      } else {
        setOrders([]);
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  if (loading) return <Loading />;


  return (
    <Box sx={{px:{xs:"20px",md:"0px"}}}>
      <Typography variant="h4">Order History</Typography>
      <Box >
        {orders.map(order => (
          <>
            <Box display={'flex'} flexDirection={{xs:"column",md:'row'}} alignItems={{xs:"self-start",md:'center'}} justifyContent={{xs:"center",md:'space-between'}}>
              <Box key={order.id} >
                {order.items?.map((item) => (
                  <>
                    <Box display={'flex'} flexDirection={'row'} gap={4} alignItems={'center'} my={2}>
                      <img src={item.image} alt={item.name} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '10px' }} loading="lazy" />
                      <Box>
                        <Typography variant="body1" mb={2}>Product Name: {item.name}</Typography>
                        <Typography variant="subtitle2" color="#4b4b4b">quantity: {item.quantity}</Typography>
                        <Typography variant="subtitle2" color="#4b4b4b">price: {item.price}</Typography>
                      </Box>
                    </Box>
                  </>
                ))}
                <Typography><b>Total Price</b>: {order.totalAmount}</Typography>
              </Box>
              <Typography><b>Date</b>: {order.timestamp.toDate().toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ pb: 2 }} />
          </>
        ))}
      </Box>
    </Box>
  );
}
