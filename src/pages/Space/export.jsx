import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CMGExportSpace from '../../components/CMGExportSpace';
import { getSpaceService } from '../../services/space.services';
import { useAlertContext } from '../../contexts/AlertContext';

const ExportSpace = () => {
  const param = useParams();
  const [space, setSpace] = useState();
  const { showAlert } = useAlertContext();

  useEffect(() => {
    getSpaceService(param.id)
      .then((response) => setSpace(response))
      .catch((error) => {
        showAlert({
          title: 'Error',
          description: error.message || 'Something went wrong',
          status: 'error',
        });
      })
  }, [param.id])

  return (
    space && <CMGExportSpace space={space} />
  );
};

export default ExportSpace;
