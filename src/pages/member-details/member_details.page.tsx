import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Breadcrumb, Flex, Space, message, Divider } from 'antd';
import { LeftOutlined, EditOutlined, DeleteOutlined, PrinterOutlined } from '@ant-design/icons';
import { AsyncPageContentLayout } from '@/components/layout';
import { UI_STATE_TYPE } from '@/interactors/_state';

// Component imports
import { MemberHeader } from './components/header';
import { PersonalInfoCard } from './components/personal_info_card';
import { ChurchInfoCard } from './components/church_info_card';
import { FamilyInfoCard } from './components/family_info_card';
import { VolunteerInfoCard } from './components/volunteer_info_card';
import { AdditionalInfoCard } from './components/additional_info_card';
import { MemberDetailsSuccessState, MemberDetailsUIState } from '@/interactors/member-details';
import { useMemberDetails } from '@/interactors/member-details';

// Header component with breadcrumb and actions
const MemberDetailsHeader: React.FC<{ state: MemberDetailsSuccessState }> = ({ state }) => {
    const navigate = useNavigate();
    const { memberId } = useParams<{ memberId: string }>();

    if (state.type !== UI_STATE_TYPE.success) return null;

    const { actions } = state;

    const handleEdit = () => {
        navigate(`/members/edit/${memberId}`);
    };

    const handleDelete = () => {
        actions.deleteMember();
    };

    const handlePrint = () => {
        // Implement print functionality
        message.info('Printing functionality to be implemented');
    };

    return (
        <Flex vertical gap="middle" style={{ width: '100%', marginBottom: 16 }}>
            <Breadcrumb
                items={[
                    { title: <a onClick={() => navigate('/members')}>Members</a> },
                    { title: 'Member Details' },
                ]}
            />

            <Flex justify="space-between" align="center">
                <Button icon={<LeftOutlined />} onClick={() => navigate('/members')}>
                    Back to Members
                </Button>

                <Space>
                    <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                        Print
                    </Button>
                    <Button icon={<EditOutlined />} type="primary" onClick={handleEdit}>
                        Edit
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </Space>
            </Flex>

            <Divider style={{ margin: '12px 0' }} />
        </Flex>
    );
};

// Main content when data is successfully loaded
const SuccessView: React.FC<{ state: MemberDetailsSuccessState }> = ({ state }) => {
    const { member } = state;

    return (
        <Flex vertical gap="large">
            <MemberHeader member={member} />

            <Flex gap="middle" style={{ flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 calc(50% - 8px)', minWidth: '400px' }}>
                    <PersonalInfoCard member={member} />
                </div>
                <div style={{ flex: '1 1 calc(50% - 8px)', minWidth: '400px' }}>
                    <ChurchInfoCard member={member} />
                </div>
            </Flex>

            <Flex gap="middle" style={{ flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 calc(50% - 8px)', minWidth: '400px' }}>
                    <FamilyInfoCard member={member} />
                </div>
                <div style={{ flex: '1 1 calc(50% - 8px)', minWidth: '400px' }}>
                    <VolunteerInfoCard member={member} />
                </div>
            </Flex>

            <AdditionalInfoCard member={member} />
        </Flex>
    );
};

// Main component
export const MemberDetailsPage: React.FC = () => {
    const { memberId } = useParams<{ memberId: string }>();
    const state = useMemberDetails(memberId);

    return (
        <AsyncPageContentLayout
            state={state}
            SuccessView={SuccessView}
            header={<MemberDetailsHeader state={state} />}
        />
    );
};

export default MemberDetailsPage;