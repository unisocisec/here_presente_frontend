import React, { useEffect, useState } from 'react';
import TemplatePage from '../components/templatePage';
import StudentReport from '../components/StudentReport';
import { Button, Select, Tabs, TabList, Tab, Link, useToast, Table, Thead, Tbody, Tr, Td, Th, Skeleton } from "@chakra-ui/react";
import Calendar from 'react-calendar';
import { ExternalLinkIcon } from '@chakra-ui/icons'
import '../styles/pages/callReports.css';
import api from "../services/api";
import { useParams } from 'react-router-dom'
import Pagination from '@material-ui/lab/Pagination';

function ExportAnswers(classroomId, toast) {
  const token = localStorage.getItem('token')
  const BASE_URL = process.env.REACT_APP_WEATHER_BASE_URL;
  api.get(`/api/v1/classrooms/${classroomId}/export_student_answers_in_classroom`, { headers: { Authorization: token } }).then(response => {
    window.open(`${BASE_URL}${response.data.path}`, '_blank')
  }).catch(_err => {
    toast({
      title: "Falha na exportação",
      description: "comunique o suporte em https://github.com/unisocisec/here_present_frontend",
      position: "bottom-right",
      status: "error",
      duration: 6000,
      isClosable: true,
    })
  }
)}

function CallReports({ history }) {
  const toast = useToast()
  const arrayLoading = ["asdasasd", "asdasdasd", "ASDASD"]
  const classroomId = useParams().classroom_id
  const [callListId, setCallListId] = useState()
  const [TokenCallListId, setTokenCallListId] = useState(null)
  const [studentAnswers, setStudentAnswers] = useState([])
  const [filterAllCallList, setFilterAllCallList] = useState(true)
  const [callLists, setCallLists] = useState([])
  const [page, setPage] = useState(1);

  const handleChangePage = (_event, value) => {
    setPage(value);
  };


  useEffect(() => {
    async function getStudentAnswers(classroomId, page = 1) {
      const token = localStorage.getItem('token')
      const response = await api.get(`/api/v1/classrooms/${classroomId}/classroom_student_answers?page=${page}`, { headers: { Authorization: token } })
      setStudentAnswers(response.data)
    }
    getStudentAnswers(classroomId)
    async function getCallLists(classroomId) {
      const token = localStorage.getItem('token')
      const response = await api.get(`/api/v1/classrooms/${classroomId}/classroom_call_lists`, { headers: { Authorization: token } })
      setCallLists(response.data)
    }
    getCallLists(classroomId)
  }, [filterAllCallList])

  function SelectCallListId() {
    const call_list_id = document.getElementById("selectCallList").value;
    if (call_list_id === "" || call_list_id === "all") {
      setFilterAllCallList(true)
    } else {
      setFilterAllCallList(false)
      setCallListId(call_list_id)
      SelectTokenCallListId(call_list_id)
    }
  }

  async function SelectTokenCallListId(call_list_id) {
    const token = localStorage.getItem('token')
    const response = await api.get(`/api/v1/call_lists/${call_list_id}`, { headers: { Authorization: token } })
    setTokenCallListId(response.data.token_call_list)
  }

  return (
    <TemplatePage nameButton={'Criar Chamada'} acitiveButton={true} acitiveUser={true} history={history}>
      <div className='callReports'>
        <div className='callSelection'>
          <div className="selection">
            <Select placeholder="Todas as Chamadas" id="selectCallList" borderColor="#00ADB5" onChange={() => SelectCallListId()} size="lg" >
              {callLists.map(callList => <option key={`call_list_${callList.id}`} value={callList.id}>{callList.title}</option>)}
            </Select>
          </div>
          <Calendar className='calendar' />
        </div>
        <div className='actions'>
          <div className='buttonPosition'>
            <div className='exportButton'>
              <Button colorScheme="teal" size="lg" type="link" onClick={() => ExportAnswers(classroomId, toast)}>Exportar Chamadas</Button>
              {
                !!TokenCallListId
                ?
                  <Link ml="5" href={`../AnswerCall/${TokenCallListId}`} isExternal>
                    Link da Chamada <ExternalLinkIcon mx="2px" />
                  </Link>
                :
                <div></div>
              }
            </div>
            <div className='tabs'>
              <Tabs variant="enclosed">
                <TabList>
                  <Tab>Relatório</Tab>
                  {/* <Tab>Membros</Tab> */}
                </TabList>
              </Tabs>
            </div>
          </div>
        </div>
        <div className='table'>
          <Pagination className="paginateCallReports" count={10} page={page} onChange={handleChangePage} />
          <div className='bard' >
            <Table variant="striped" colorScheme="teal" >
              <Thead>
                <Tr>
                  <Th>Nome do aluno </Th>
                  <Th>E-mail</Th>
                  <Th>Palavra-Chave</Th>
                  <Th>Check</Th>
                </Tr>
              </Thead>
              <Tbody key={'tbody'}>
                {
                  
                  filterAllCallList
                    ? studentAnswers.map(studentAnswer =>
                      <StudentReport key={`student_${studentAnswer.id}`} dataKey={studentAnswer.id} name={studentAnswer.full_name} email={studentAnswer.email} confirmationCode={studentAnswer.confirmation_code} check={studentAnswer.answer_correct} />
                    )
                    : arrayLoading.map(i =>
                      <Tr key={`Tr_${i}`}><Td key={`Td_${i}`}><Skeleton key={`Skeleton_${i}`} isLoaded={!filterAllCallList} h="40px" /></Td></Tr>
                    )
                }
              </Tbody>
            </Table>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
}

export default CallReports;
