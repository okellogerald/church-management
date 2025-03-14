import { ReactNode } from 'react';
import { Form, Card, Typography, Divider, Row, Col } from 'antd';
import { FormInstance, FormItemProps } from 'antd/es/form';
import { SchemaFormFieldDefinition } from './types';

const { Title, Text } = Typography;

/**
 * Props for the SchemaFormSection component
 */
interface SchemaFormSectionProps<T, K extends keyof T = keyof T> {
    // Form instance
    form: FormInstance;

    // Title for the section
    title: ReactNode;

    // Optional description
    description?: ReactNode;

    // Fields to include - can be array of field definitions or a record of field definitions
    fields: SchemaFormFieldDefinition<T, K>[] | Record<string, SchemaFormFieldDefinition<T, K>>;

    // Layout definition (row-based)
    layout?: {
        rows: Record<string, K[]>;
        span?: number; // Default column span
    };

    // Footer content (optional)
    footer?: ReactNode;
}

/**
 * Helper type to extract form item props safely
 */
type AntFormItemProps = Omit<FormItemProps<any>, 'children'>;

/**
 * Helper function to extract Ant Design compatible form item props
 * This resolves the type mismatch issues with name property
 */
function extractFormItemProps(props: any): AntFormItemProps {
    // Destructure props to extract only what's needed for Form.Item
    const { label, name, rules, valuePropName, getValueProps, ...restProps } = props;

    // Return a properly typed object for Form.Item
    return {
        label,
        name,
        rules,
        valuePropName,
        getValueProps,
        ...restProps,
    };
}

/**
 * A reusable component for rendering form sections based on a schema
 */
export function SchemaFormSection<
    T,
    K extends keyof T = keyof T
>({
    form,
    title,
    description,
    fields,
    layout,
    footer,
}: SchemaFormSectionProps<T, K>) {
    // Convert fields to array if it's an object
    const fieldsArray = Array.isArray(fields) ? fields : Object.values(fields);

    // If we have a layout, render according to that structure
    if (layout) {
        // Validate that all fields in layout are in fields
        const fieldsInLayout = Object.values(layout.rows).flat();
        const fieldNames = fieldsArray.map(field => field.name);
        const missingFields = fieldsInLayout.filter(
            (field) => !fieldNames.includes(field as any)
        );

        if (missingFields.length > 0) {
            console.warn(`Layout contains fields not included in the fields prop: ${missingFields.join(', ')}`);
        }

        return (
            <Card>
                <Title level={5}>{title}</Title>
                {description && <Text type="secondary">{description}</Text>}
                <Divider />

                <Form form={form} layout="vertical">
                    {Object.entries(layout.rows).map(([rowKey, rowFields]) => (
                        <Row key={rowKey} gutter={16}>
                            {rowFields.map((fieldName) => {
                                // Find field definition by name
                                const fieldData = fieldsArray.find((f) => f.name === fieldName);
                                if (!fieldData) return null;

                                // Calculate column span - default to dividing 24 by number of fields in row
                                const defaultSpan = layout.span || Math.floor(24 / rowFields.length);
                                const span = layout.span || defaultSpan;

                                // Create the form field
                                const formItemProps = extractFormItemProps({
                                    name: fieldData.name,
                                    label: fieldData.label,
                                    rules: fieldData.rules,
                                    valuePropName: fieldData.valuePropName,
                                });

                                return (
                                    <Col key={String(fieldName)} span={span}>
                                        <Form.Item {...formItemProps}>
                                            {fieldData.render()}
                                        </Form.Item>
                                    </Col>
                                );
                            })}
                        </Row>
                    ))}

                    {footer && (
                        <>
                            <Divider />
                            {footer}
                        </>
                    )}
                </Form>
            </Card>
        );
    }

    // If no layout provided, render fields in a simple list
    return (
        <Card>
            <Title level={5}>{title}</Title>
            {description && <Text type="secondary">{description}</Text>}
            <Divider />

            <Form form={form} layout="vertical">
                {fieldsArray.map((fieldData) => {
                    const formItemProps = extractFormItemProps({
                        name: fieldData.name,
                        label: fieldData.label,
                        rules: fieldData.rules,
                        valuePropName: fieldData.valuePropName,
                    });

                    return (
                        <Form.Item key={String(fieldData.name)} {...formItemProps}>
                            {fieldData.render()}
                        </Form.Item>
                    );
                })}

                {footer && (
                    <>
                        <Divider />
                        {footer}
                    </>
                )}
            </Form>
        </Card>
    );
}