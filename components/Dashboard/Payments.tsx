import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";



const latestTransactions = [
  {
    id: 1,
    title: "Subscription Renewal",
    badge: "John Doe",
    image:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 1400,
  },
  {
    id: 2,
    title: "Payment for Services",
    badge: "Jane Smith",
    image:
      "https://images.pexels.com/photos/4969918/pexels-photo-4969918.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 2100,
  },
  {
    id: 3,
    title: "Subscription Renewal",
    badge: "Michael Johnson",
    image:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 1300,
  },
  {
    id: 4,
    title: "Payment for Services",
    badge: "Lily Adams",
    image:
      "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 2500,
  },
  {
    id: 5,
    title: "Subscription Renewal",
    badge: "Sam Brown",
    image:
      "https://images.pexels.com/photos/1680175/pexels-photo-1680175.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 1400,
  },
];

const CardList = () => {

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">اخر الإشتراكات</h1>
      <div className="flex flex-col gap-2">
        {latestTransactions.map((item) => (
          <Card key={item.id} className="flex-row items-center justify-between gap-4 p-4">
            <div className="w-12 h-12 rounded-sm relative overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <Badge variant="secondary">{item.badge}</Badge>
            </CardContent>
            <CardFooter className="p-0">{item.count / 1000}K</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardList;