import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Star, TrendingUp, Book, Puzzle, Filter, CircleDollarSign } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

// Extend window type for Razorpay
declare global {
  interface Window {
    Razorpay: any; // Use 'any' for simplicity, or define specific types if needed
  }
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f97316'];

// Interface for the actual Article data from API
interface FetchedArticle {
  _id: string;
  title: string;
  author: string;
  createdAt: string;
  // Add other fields if needed/available from GET /api/articles
}

interface DashboardData {
  payments: { value: number; trend: number };
  words: { value: number; trend: number };
  engagement: { value: number; trend: number };
  articles: Array<{ id: number; name: string; rating: number; views: string }>;
  trends: Array<{ name: string; value: number }>;
  categories: Array<{ name: string; popularity: string; progress: number }>;
  audience: Array<{ name: string; value: number }>;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [timeframe, setTimeframe] = useState('today');
  // State for the static/simulated data (Payments/Engagement/Categories/Audience)
  const [dashboardStats, setDashboardStats] = useState({
    categories: [
      { name: 'Technology', popularity: '15.1k', progress: 75 }, 
      { name: 'Design', popularity: '12.3k', progress: 60 },
      { name: 'Business', popularity: '10.5k', progress: 45 },
    ],
    audience: [
      { name: 'Desktop', value: 400 }, 
      { name: 'Mobile', value: 300 },
      { name: 'Tablet', value: 200 }, 
      { name: 'Others', value: 100 },
    ],
  });
  // State for fetched stats (Words/Trends/Engagement/Rating/Performance)
  const [fetchedStats, setFetchedStats] = useState<{ 
    words: { value: number | null }; 
    trends: { name: string; value: number }[] | null; 
    engagement: { value: number | null };
    overallRating: { value: number | null };
    performance: { feedbacks: number | null }; // Added performance
    payments: { value: number | null }; // Added payments
  }>({ 
    words: { value: null }, trends: null, engagement: { value: null },
    overallRating: { value: null }, performance: { feedbacks: null },
    payments: { value: null } // Initialize payments
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  // State for fetched articles (remains)
  const [realArticles, setRealArticles] = useState<FetchedArticle[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // useEffect for fetching real articles
  useEffect(() => {
    const fetchRealArticles = async () => {
      setIsLoadingArticles(true);
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const fetchedData = await response.json();
        setRealArticles(fetchedData);
      } catch (error) {
        console.error("Error fetching real articles:", error);
        // Handle error state if needed
      } finally {
        setIsLoadingArticles(false);
      }
    };
    fetchRealArticles();
  }, []); // Runs once on mount

  // useEffect for fetching dashboard stats (All)
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const fetchedData = await response.json();
        setFetchedStats({
          words: fetchedData.words || { value: 0 },
          trends: fetchedData.trends || [],
          engagement: fetchedData.engagement || { value: 0 },
          overallRating: fetchedData.overallRating || { value: 0 },
          performance: fetchedData.performance || { feedbacks: 0 },
          payments: fetchedData.payments || { value: 0 } // Added payments
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setFetchedStats({ 
          words: { value: null }, trends: [], 
          engagement: { value: null }, overallRating: { value: null },
          performance: { feedbacks: null },
          payments: { value: null } // Set payments error state
        });
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value)
    // Fetch stats based on timeframe here
  }

  // --- Payment Handling Logic ---
  const handlePayment = async (amount: number) => {
    setIsProcessingPayment(true);
    toast({ title: "Initiating Payment..." });

    try {
      // 1. Create Order on Backend
      const orderResponse = await fetch('/api/payments/create-order', { 
        method: 'POST' 
        // Body might be needed if amount isn't fixed later
      });
      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // 2. Setup Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RZP_KEYID, // IMPORTANT: Use NEXT_PUBLIC_ prefix for client-side env vars
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Stick&Dot Platform", // Your app/site name
        description: "Test Transaction", // Transaction description
        order_id: orderData.orderId,
        handler: async function (response: any) {
           toast({ title: "Payment Successful! Verifying..." });
           console.log("Razorpay Response:", response);
           // 3. Verify Payment on Backend
           try {
              const verifyResponse = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              
              const verifyResult = await verifyResponse.json();
              
              if (verifyResponse.ok && verifyResult.verified) {
                toast({ title: "Verification Successful!", description: `Payment ID: ${response.razorpay_payment_id}` });
                // TODO: Update UI or user state based on successful payment (e.g., fetch new stats)
              } else {
                throw new Error(verifyResult.error || 'Payment verification failed.');
              }
              
           } catch (verifyError) {
               console.error("Verification Error:", verifyError);
               toast({ 
                 title: "Verification Failed", 
                 description: verifyError instanceof Error ? verifyError.message : "Could not verify payment.",
                 variant: "destructive"
               });
           }
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          // contact: "9999999999" // Optional
        },
        notes: {
          address: "Stick&Dot Corporate Office" // Optional
        },
        theme: {
          color: "#111111" // Theme color
        }
      };

      // 4. Open Razorpay Checkout
      if (typeof window !== 'undefined' && window.Razorpay) {
         const rzp = new window.Razorpay(options);
         rzp.on('payment.failed', function (response: any){
              console.error("Razorpay Payment Failed:", response.error);
              toast({ 
                title: "Payment Failed", 
                description: `${response.error.description} (${response.error.code})`, 
                variant: "destructive"
              });
         });
         rzp.open();
      } else {
         throw new Error("Razorpay checkout script not loaded.");
      }

    } catch (error) {
      console.error("Payment Initiation Error:", error);
      toast({ 
        title: "Payment Error", 
        description: error instanceof Error ? error.message : "Could not initiate payment.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };
  // --- End Payment Logic ---

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome, {session?.user?.name || 'User'}
          </h1>
          <p className="text-muted-foreground">Your Dashboard Preview</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={timeframe === 'today' ? 'default' : 'secondary'}
            onClick={() => handleTimeframeChange('today')}
            size="sm"
          >
            Today
          </Button>
          <Button 
            variant={timeframe === 'custom' ? 'default' : 'secondary'}
            onClick={() => handleTimeframeChange('custom')}
            size="sm"
          >
            Select Date
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => handlePayment(1000)}
            disabled={isProcessingPayment}
            size="sm"
          >
            {isProcessingPayment ? "Processing..." : "Pay ₹10"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payments received</p>
                 {isLoadingStats ? (
                   <Skeleton className="h-8 w-28 mt-1" />
                 ) : fetchedStats.payments.value !== null ? (
                   <h3 className="text-2xl font-bold">Rs. {fetchedStats.payments.value.toLocaleString()}</h3>
                 ) : (
                   <p className="text-sm text-destructive">Error</p>
                 )}
              </div>
              <div className="p-2 bg-primary/10 text-primary rounded-md">
                 <CircleDollarSign className="w-5 h-5" />
              </div>
            </div>
             <div className="h-3"></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
             <div className="flex items-start justify-between mb-2">
               <div>
                 <p className="text-sm text-muted-foreground mb-1">Words written</p>
                 {isLoadingStats ? (
                   <Skeleton className="h-8 w-24 mt-1" />
                 ) : fetchedStats.words.value !== null ? (
                   <h3 className="text-2xl font-bold">{fetchedStats.words.value.toLocaleString()}</h3>
                 ) : (
                   <p className="text-sm text-destructive">Error</p>
                 )}
               </div>
               <div className="p-2 bg-blue-500/10 text-blue-500 rounded-md"> 
                 <Book className="w-5 h-5" />
               </div>
             </div>
             <div className="h-3"></div>
          </CardContent>
        </Card>
         <Card>
          <CardContent className="p-4 md:p-6">
             <div className="flex items-start justify-between mb-2">
               <div>
                 <p className="text-sm text-muted-foreground mb-1">Avg Comments/Article</p>
                 {isLoadingStats ? (
                   <Skeleton className="h-8 w-16 mt-1" />
                 ) : fetchedStats.engagement.value !== null ? (
                   <h3 className="text-2xl font-bold">{fetchedStats.engagement.value.toFixed(1)}</h3>
                 ) : (
                   <p className="text-sm text-destructive">Error</p>
                 )}
               </div>
                <div className="p-2 bg-green-500/10 text-green-500 rounded-md">
                 <Puzzle className="w-5 h-5" />
               </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Your Top Articles</CardTitle>
              <Link href="/articles">
                 <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
             {isLoadingArticles ? (
                <p className="text-muted-foreground text-sm">Loading articles...</p>
              ) : realArticles.length === 0 ? (
                 <p className="text-muted-foreground text-sm">No articles found.</p>
              ) : (
                realArticles.slice(0, 3).map((article) => (
                  <div key={article._id} className="flex items-center justify-between group">
                    <div>
                      <Link href={`/articles/${article._id}`} className="text-sm font-medium hover:underline">
                        {article.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                         by {article.author} • {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Trends</CardTitle>
              <Select defaultValue="payment">
                <SelectTrigger className="w-auto text-xs h-8">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="views">Views</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="h-[200px] w-full pt-0">
            {isLoadingStats ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-4/5 w-full" />
              </div>
            ) : fetchedStats.trends && fetchedStats.trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fetchedStats.trends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10}/>
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
               <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">No trend data available.</p>
               </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Top Category</CardTitle>
              <Select defaultValue="this-week">
                <SelectTrigger className="w-auto text-xs h-8">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {dashboardStats.categories.map((category: any, index: number) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className="p-2 bg-muted rounded-md">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium text-foreground group-hover:underline">{category.name}</span>
                    <span className="text-muted-foreground">{category.popularity}</span>
                  </div>
                  <Progress value={category.progress} className="h-2 [&>div]:bg-primary" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Audience</CardTitle>
              <Button variant="ghost" size="sm">Details</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="aspect-square relative my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardStats.audience}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {dashboardStats.audience.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-foreground">
                    {(dashboardStats.audience.reduce((a: number, b: any) => a + b.value, 0) / 1000).toFixed(1)}K
                  </span>
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {dashboardStats.audience.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">
                     {((item.value / dashboardStats.audience.reduce((a: number, b: any) => a + b.value, 0)) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your Recent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="block text-2xl font-bold mb-1 text-foreground">12k</span>
                <span className="text-xs text-muted-foreground">Impressions</span>
              </div>
              <div className="border-l border-r border-border px-4">
                <span className="block text-2xl font-bold mb-1 text-foreground">12k</span>
                <span className="text-xs text-muted-foreground">Likes</span>
              </div>
              <div>
                {isLoadingStats ? (
                   <Skeleton className="h-7 w-12 mx-auto mb-1" />
                ) : fetchedStats.performance.feedbacks !== null ? (
                   <span className="block text-2xl font-bold mb-1 text-foreground">
                      {fetchedStats.performance.feedbacks.toLocaleString()}
                   </span>
                ) : (
                   <span className="block text-2xl font-bold mb-1 text-destructive">N/A</span>
                )}
                <span className="text-xs text-muted-foreground">Feedbacks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Overall Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              {isLoadingStats ? (
                 <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-4 w-24" />
                 </div>
              ) : fetchedStats.overallRating.value !== null ? (
                <>
                   <div>
                      <span className="block text-2xl font-bold mb-1 text-foreground">
                          {fetchedStats.overallRating.value.toFixed(1)}/5
                      </span>
                      <div className="flex gap-1 h-4">{/* Placeholder for stars */}</div>
                   </div>
                   <div className="text-right">
                      <span className="text-xs text-muted-foreground">Based on all comments</span>
                   </div>
                </>
              ) : (
                 <p className="text-sm text-destructive">Error loading rating</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 