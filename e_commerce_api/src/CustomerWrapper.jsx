import { useParams, useNavigate } from 'react-router-dom';
import Customer from './Customer';

function CustomerWrapper(props) {
    const params = useParams();
    const navigate = useNavigate();
    return <Customer {...props} params={params} navigate={navigate} />;
}

export default CustomerWrapper;
