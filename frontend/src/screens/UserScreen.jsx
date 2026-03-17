import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Button, Card, Container, Form, Modal, Nav, Table } from 'react-bootstrap';
import '../styles/ServiceScreens.css';
import { getStoredUser, setStoredUser } from '../utils/auth';

const ADMIN_USERS_API_URL = 'http://localhost:8000/api/admin/users/';
const ADMIN_APPLICATIONS_API_URL = 'http://localhost:8000/api/admin/seller-applications/';

function UserScreen() {
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '' });
  const [declineUser, setDeclineUser] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [approveUser, setApproveUser] = useState(null);
  const [merchantId, setMerchantId] = useState('');

  useEffect(() => {
    const loadAdminData = async () => {
      if (!currentUser || currentUser.user_type !== 'admin') {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const [usersResponse, applicationsResponse] = await Promise.all([
          axios.get(ADMIN_USERS_API_URL, { params: { admin_email: currentUser.email } }),
          axios.get(ADMIN_APPLICATIONS_API_URL, { params: { admin_email: currentUser.email } }),
        ]);

        setUsers(usersResponse.data.users);
        setApplications(applicationsResponse.data.applications);
      } catch (err) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.message === 'Network Error') {
          setError('Unable to connect to the backend. Make sure Django is running on http://localhost:8000.');
        } else {
          setError('Ayaw mag load admin data.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [currentUser]);

  const openEditModal = (user) => {
    setEditUser(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${ADMIN_USERS_API_URL}${editUser.id}/`,
        { ...editForm, admin_email: currentUser.email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setUsers((prev) => prev.map((user) => (user.id === editUser.id ? response.data.user : user)));
      if (currentUser.id === editUser.id) {
        setStoredUser(response.data.user);
        setCurrentUser(response.data.user);
      }
      setEditUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${ADMIN_USERS_API_URL}${userId}/`, {
        headers: { 'Content-Type': 'application/json' },
        data: { admin_email: currentUser.email },
      });

      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleApprove = async () => {
    try {
      const response = await axios.post(
        `${ADMIN_APPLICATIONS_API_URL}${approveUser.id}/approve/`,
        { admin_email: currentUser.email, merchant_id: merchantId },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setUsers((prev) => prev.map((user) => (user.id === approveUser.id ? response.data.user : user)));
      setApplications((prev) => prev.filter((user) => user.id !== approveUser.id));
      setApproveUser(null);
      setMerchantId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve application.');
    }
  };

  const handleDecline = async () => {
    try {
      const response = await axios.post(
        `${ADMIN_APPLICATIONS_API_URL}${declineUser.id}/decline/`,
        { admin_email: currentUser.email, decline_reason: declineReason },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setUsers((prev) => prev.map((user) => (user.id === declineUser.id ? response.data.user : user)));
      setApplications((prev) => prev.filter((user) => user.id !== declineUser.id));
      setDeclineUser(null);
      setDeclineReason('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to decline application.');
    }
  };

  if (!currentUser || currentUser.user_type !== 'admin') {
    return (
      <div className="service-page py-5">
        <Container>
          <Card className="service-box border-0 mx-auto" style={{ maxWidth: '40rem' }}>
            <Card.Body className="p-4 p-md-5 text-center">
              <h1 className="h3 mb-3">Admin Access Only</h1>
              <p className="text-body-secondary mb-0">This page is only accessible by admin accounts.</p>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="service-page py-5">
      <Container>
        <Card className="service-box border-0">
          <Card.Body className="p-4 p-md-5">
            <h1 className="h3 mb-3">User Management</h1>
            <p className="text-body-secondary mb-4">
              Manage users on the platform and review pending seller applications.
            </p>
            {error && <Alert variant="danger">{error}</Alert>}

            <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey || 'users')} className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="users">Users</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="applications">Seller Applications</Nav.Link>
              </Nav.Item>
            </Nav>

            {loading ? (
              <p className="mb-0">Loading...</p>
            ) : activeTab === 'users' ? (
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.first_name}</td>
                      <td>{user.last_name}</td>
                      <td>{user.email}</td>
                      <td className="d-flex gap-2">
                        <Button variant="outline-dark" size="sm" className="rounded-0" onClick={() => openEditModal(user)}>
                          Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" className="rounded-0" onClick={() => handleDeleteUser(user.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">No pending seller applications.</td>
                    </tr>
                  ) : applications.map((user) => (
                    <tr key={user.id}>
                      <td>{user.first_name}</td>
                      <td>{user.last_name}</td>
                      <td>{user.email}</td>
                      <td className="d-flex gap-2">
                        <Button variant="outline-dark" size="sm" className="rounded-0" onClick={() => setApproveUser(user)}>
                          Approve
                        </Button>
                        <Button variant="outline-danger" size="sm" className="rounded-0" onClick={() => setDeclineUser(user)}>
                          Decline
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>

      <Modal show={Boolean(editUser)} onHide={() => setEditUser(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="edit_first_name">
              <Form.Label>First Name</Form.Label>
              <Form.Control name="first_name" value={editForm.first_name} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="edit_last_name">
              <Form.Label>Last Name</Form.Label>
              <Form.Control name="last_name" value={editForm.last_name} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group controlId="edit_email">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" value={editForm.email} onChange={handleEditChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" className="rounded-0" onClick={() => setEditUser(null)}>
            Cancel
          </Button>
          <Button variant="outline-dark" className="rounded-0" onClick={handleSaveEdit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={Boolean(approveUser)} onHide={() => { setApproveUser(null); setMerchantId(''); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Approve Seller</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="merchant_id">
            <Form.Label>Merchant ID</Form.Label>
            <Form.Control value={merchantId} onChange={(event) => setMerchantId(event.target.value)} placeholder="Enter merchant ID" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" className="rounded-0" onClick={() => { setApproveUser(null); setMerchantId(''); }}>
            Cancel
          </Button>
          <Button variant="outline-dark" className="rounded-0" onClick={handleApprove}>
            Approve
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={Boolean(declineUser)} onHide={() => { setDeclineUser(null); setDeclineReason(''); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Decline Seller Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="decline_reason">
            <Form.Label>Reason for Declining</Form.Label>
            <Form.Control as="textarea" rows={4} value={declineReason} onChange={(event) => setDeclineReason(event.target.value)} placeholder="Enter the reason for declining" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" className="rounded-0" onClick={() => { setDeclineUser(null); setDeclineReason(''); }}>
            Cancel
          </Button>
          <Button variant="outline-danger" className="rounded-0" onClick={handleDecline}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserScreen;
