import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
const Alert = ({ title, iconUrl }) => {
  const {classroomId} = useParams()
    return (<section className="flex-center h-screen w-full">
      <Card className="w-full max-w-[520px] border-none bg-dark-1 p-6 py-9 text-white">
        <CardContent>
          <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-3.5">
              {iconUrl && (<div className="flex-center">
                  <img src={iconUrl} width={72} height={72} alt="icon"/>
                </div>)}
              <p className="text-center text-xl font-semibold">{title}</p>
            </div>

            <Button asChild className="bg-blue-1">
              <Link to={`/classrooms/${classroomId}`}>Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>);
};
export default Alert;
